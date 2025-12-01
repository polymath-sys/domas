# Backend / Data Fetch Flow — Domas

This document explains, in simple terms, how the Domas frontend communicates with the backend (Firebase Authentication and Firestore). After reading this you should be able to describe the network flow and show which files implement each step.

---

## Quick overview

- The app is a client-only React SPA. There is no custom server; Firebase (Auth + Firestore) acts as the backend-as-a-service.
- The Firebase JS SDK (imported in `src/firebase.jsx` and used across the app) handles low-level network requests to Firebase services.
- Authentication requests (signup / signin) go to the Identity Toolkit API (Google Identity Platform) and return a user credential + ID token.
- Firestore reads/writes use the Firestore API (via the SDK). Realtime updates use Firestore's listener API (`onSnapshot`) which keeps a live connection so the UI updates immediately when data changes.

---

## Key files (where to look in the code)

- `src/firebase.jsx` — initializes Firebase app and exports `auth` and `db`.
- `src/Register.jsx` — registration: uses `createUserWithEmailAndPassword(auth, email, password)` and `setDoc` to write user document.
- `src/Login.jsx` — login: uses `signInWithEmailAndPassword` (similar to register).
- `src/components/Profile/Profilepage.jsx` — reads user document using `getDoc` and updates via `updateDoc`.
- `src/components/Rightsidebar.jsx` — reads sidebar user details and attaches a realtime listener to `announcements` using `onSnapshot`.
- `src/App.jsx` — uses `useAuthState(auth)` to track the authentication state and gate routes.

---

## Authentication flow (high level)

1. User submits the register or login form (handled in `src/Register.jsx` / `src/Login.jsx`).
2. The app calls Firebase Auth SDK functions: e.g. `createUserWithEmailAndPassword(auth, email, password)`.
3. The SDK sends an HTTPS POST to the Identity Toolkit endpoint (something like `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]`).
4. If successful, Firebase returns an object with the user's `uid` and an ID token (JWT). The SDK stores the authenticated user object in memory and keeps the token refreshed.
5. `useAuthState(auth)` (in `src/App.jsx` or other components) reads the current user and triggers component updates.

Notes about the token: the Firebase SDK automatically attaches the user's ID token to Firestore requests on your behalf; you don't need to manually attach it.

---

## Firestore reads & writes (non-realtime)

Example (what the code does):
- Register writes a user document: `await setDoc(doc(db, 'user', user.uid), {...})` (see `src/Register.jsx`).
- Profile reads a user document: `const docSnap = await getDoc(doc(db, 'user', userId));` (see `src/components/Profile/Profilepage.jsx`).

What happens on the network:
- The SDK issues authenticated HTTPS requests to Firestore endpoints (`firestore.googleapis.com`), including the ID token for authentication.
- Firestore enforces security rules on the server; the request succeeds only if rules allow it (e.g., `request.auth.uid == uid`). If not allowed, the response is an error like `permission-denied`.

---

## Realtime listeners (onSnapshot) — how announcements update live

Where: `src/components/Rightsidebar.jsx` attaches a listener:

- `onSnapshot(query(collection(db, 'announcements'), orderBy('createdAt', 'desc'), limit(3)), callback)`

How it works:
- The SDK sets up a persistent connection to Firestore (internally it uses gRPC-web or an HTTP-based channel depending on the environment). This keeps the client synchronized with the server.
- When the server has new data matching the query (e.g., a new announcement), Firestore pushes the change to the client over that channel.
- The SDK runs your callback with a `QuerySnapshot`. The callback code converts the snapshot into JS data and updates React state.

Important: the listener still goes through Firestore server-side security rules on every snapshot delivery — if the client lacks permission, you'll get a `FirebaseError: Missing or insufficient permissions` (we saw this earlier).

---

## Typical network endpoints you may see in DevTools

- Identity toolkit (Auth):
  - Signup: `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]`
  - SignIn: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]`

- Firestore REST / RPC endpoints (used by SDK):
  - `https://firestore.googleapis.com/v1/projects/[PROJECT_ID]/databases/(default)/documents/...`
  - The SDK may also use gRPC-Web routes for realtime listeners.

If you open the Network tab while performing an action you'll see these requests. If requests are blocked (ad-blocker) you'll see `net::ERR_BLOCKED_BY_CLIENT`.

---

## Security & server-side rules

- Firestore security rules run on the server for every read/write.
- Common rule for user documents:

```
match /user/{uid} {
  allow read, write: if request.auth != null && request.auth.uid == uid;
}
```

- For announcements, you typically allow authenticated reads:

```
match /announcements/{id} {
  allow read: if request.auth != null;
}
```

If your UI shows `Missing or insufficient permissions`, edit and publish rules in Firebase Console.

---

## Error cases & debugging tips

- `auth/configuration-not-found`: check `src/firebase.jsx` for correct `firebaseConfig` (apiKey, projectId, authDomain).
- `400 Bad Request` on identitytoolkit endpoints: check API key and that Email/Password sign-in is enabled in Firebase Console.
- `net::ERR_BLOCKED_BY_CLIENT`: disable browser ad-block/privacy extensions (test in Incognito) — extensions commonly block `firestore.googleapis.com`.
- `Missing or insufficient permissions`: review Firestore rules; ensure the authenticated user matches rule expectations and the collection/document paths are spelled correctly.

Add `console.log` at key places to inspect values:
- After sign-in: `console.log('user:', auth.currentUser)`
- Before reading user doc: `console.log('fetch user doc for uid:', user.uid)`
- In the `onSnapshot` error callback: log the error code and message.

---

## Short sequence examples (plain language)

Registration -> save user profile:
1. User fills form -> frontend calls `createUserWithEmailAndPassword`.
2. Server returns user and token -> SDK stores token.
3. Frontend calls `setDoc(doc(db,'user', uid), {...})` -> Firestore stores document.
4. On success, document visible in Firestore Console.

Page load -> read profile + listen announcements:
1. App sees a logged-in user (via `useAuthState`) and gets their `uid`.
2. App calls `getDoc(doc(db,'user', uid))` to read profile.
3. App calls `onSnapshot` on `announcements` — SDK opens a realtime channel.
4. Server sends initial announcements snapshot -> UI updates.
5. When another client writes a new announcement, server pushes the change to all listeners -> UI updates live.

---

## Where to show this in your demo (code references)

- `src/firebase.jsx` — show config and initialization.
- `src/Register.jsx` — show auth call and `setDoc`.
- `src/components/Profile/Profilepage.jsx` — show `getDoc` and `updateDoc`.
- `src/components/Rightsidebar.jsx` — show `onSnapshot` and how announcements are processed.

---

## Final notes

- The Firebase SDK removes much of the low-level complexity: you call high-level functions (Auth and Firestore) and the SDK manages tokens and network calls.
- The important things to understand and explain are: where auth is created, where documents are read/written, how listeners work, and how security rules affect reads/writes.

If you want, I can also:
- Add a simple ASCII sequence diagram to this file.
- Create a short slide-ready one-page summary.


---

*End of file*