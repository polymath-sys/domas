# Domas — Project Report

Version: simplified explanation for assessment (Software Engineering)

---

## 1. Project Summary (elevator pitch)

Domas is a small React-based web application for apartment / society management. It provides user registration and login (using Firebase Authentication), a user profile page (data stored in Firestore), and a right-hand sidebar that shows the logged-in user's details and recent announcements (announcements are delivered in real-time using Firestore's onSnapshot listener).

This report explains the code structure, technologies used, how data flows through the system, how to run and test the app locally, common issues encountered during development, and suggestions for future improvements.

---

## 2. Technologies and libraries used

- React (v18) — UI library for building components.
- Vite — development server and build tool.
- Firebase (Auth + Firestore) — backend-as-a-service for authentication and database.
  - `firebase` JS SDK used to initialize and use Auth and Firestore.
- react-router — client-side routing.
- react-firebase-hooks — convenience hooks for Auth state.
- Tailwind CSS — utility-first CSS framework used for styling.
- react-icons — icon components.

Package versions are listed in `package.json`.

---

## 3. High-level architecture

- Frontend-only single page application built with React.
- Firebase handles two responsibilities:
  - Authentication (email/password sign-up and sign-in).
  - Firestore: NoSQL document database used to store user profiles and announcements.
- Realtime features are implemented using Firestore listeners (`onSnapshot`) so announcements update immediately in the UI.

Sequence (example: registration then view profile):
1. User registers using the registration form in `src/Register.jsx`.
2. The app calls `createUserWithEmailAndPassword(auth, email, password)`.
3. On success, app writes a user document to `user/{uid}` in Firestore via `setDoc`.
4. When the user navigates to the Profile page, the app listens for the authenticated user (Auth state) and fetches the `user/{uid}` document with `getDoc`.
5. RightSidebar attaches a real-time listener to `announcements` collection (ordered by `createdAt`) with `onSnapshot` and fetches the corresponding user name for each announcement by reading `user/{userId}`.

---

## 4. Important project files and what they do

- `src/firebase.jsx` — Firebase initialization and exports of `auth` and `db`. This file contains your `firebaseConfig` object and calls `initializeApp(firebaseConfig)`, `getAuth()`, and `getFirestore()`.

- `src/main.jsx` — Application entry. Mounts the React app.

- `src/App.jsx` — Main router and top-level layout. Uses `react-router` to decide which page to render. Uses `useAuthState(auth)` from `react-firebase-hooks` to read current Auth status.

- `src/Register.jsx` — Registration form and logic:
  - Creates user using Firebase Auth.
  - Writes user document to Firestore: `setDoc(doc(db, 'user', user.uid), {...})`.

- `src/Login.jsx` — Login form (calls Firebase Auth `signInWithEmailAndPassword`).

- `src/components/Profile/Profilepage.jsx` — Reads the `user/{uid}` Firestore document and shows profile details, allowing edits which call `updateDoc`.

- `src/components/Rightsidebar.jsx` — Displays logged-in user details and recent announcements.
  - Fetches `user/{uid}` for sidebar profile details.
  - Attaches a Firestore `onSnapshot` listener to `collection(db, 'announcements')` ordered by `createdAt` to populate the announcements list in real time.

- `src/Cards/*`, `src/pages/*`, `src/components/ui/*` — UI components, cards, and pages used across the app.

- `package.json`, `vite.config.js`, `tailwind.config.js` — project configuration and tool setup.

---

## 5. Firestore data model and rules (recommended)

Collections used:
- `user` — documents keyed by Firebase UID. Example fields:
  - `name` (string)
  - `email` (string)
  - `mobile` (string)
  - `apartment` (string)
  - `wing` (string)
  - `members` (number)
  - `createdAt` (timestamp)
  - `iconColor` (string) — optional UI preference

- `announcements` — announcement documents. Example fields:
  - `content` (string)
  - `userId` (string) — UID of the user who posted the announcement
  - `createdAt` (timestamp)

Recommended Firestore rules (development-friendly and secure for authenticated reads):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /user/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }

    match /announcements/{announcementId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null; // tighten in production (e.g., only admin)
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Explanation: the rules let logged-in users read announcements and only let a user read/write their own `user/{uid}` document.

---

## 6. Common problems and debugging notes (what we saw during development)

1. "Firebase: Error (auth/configuration-not-found)": usually caused by an incorrect or missing Firebase config in `src/firebase.jsx` or using mismatched API keys/project IDs. Fix: verify `firebaseConfig` against Firebase Console → Project settings → General → Your apps.

2. `POST ... identitytoolkit ... 400 (Bad Request)`: indicates an authentication API problem — wrong API key or Auth not enabled. Fix: check API key and ensure Email/Password sign-in is enabled in Firebase Console → Authentication → Sign-in method.

3. `net::ERR_BLOCKED_BY_CLIENT`: a browser extension (ad-blocker/privacy extension) blocked requests to `firestore.googleapis.com` or other Google endpoints. Fix: disable the extension on `localhost` or test in an incognito window with extensions disabled.

4. `Missing or insufficient permissions` when reading announcements: Firestore security rules are blocking read access. Fix: publish rules that permit `request.auth != null` read access on announcements (see rules above).

We've implemented robust logging in `RightSidebar` and `Profilepage` during development to print helpful console messages.

---

## 7. How to run the project locally (step-by-step)

Prerequisites:
- Node.js (v16+ recommended)
- npm or yarn

Install dependencies:

```bash
cd /path/to/domas
npm install
```

Run dev server (Vite):

```bash
npm run dev
# open the URL shown by vite (usually http://localhost:5173)
```

Firebase setup required:
1. Create a Firebase project in the Firebase Console.
2. Enable **Authentication** → **Email/Password**.
3. Create a Firestore database in test mode (or set rules as above).
4. In Project Settings → General → Your apps → add a Web app if you haven't already, and copy the firebase config.
5. Open `src/firebase.jsx` and paste the config in the `firebaseConfig` object.
6. Restart the dev server if required.


---

## 8. How the main flows work (in plain language)

Registration:
- User fills the register form.
- The frontend calls Firebase Auth to create a user.
- On success, the frontend writes a Firestore `user/{uid}` document containing profile fields.

Login:
- User logs in via the login form.
- `useAuthState(auth)` tracks the authenticated user and displays protected pages.

Profile page:
- The app listens for the current authenticated user; once detected it reads `user/{uid}` and displays the data.
- Edits on the profile page call `updateDoc` to write changes to Firestore.

Announcements:
- The sidebar attaches a real-time `onSnapshot` listener to the `announcements` collection and shows the latest 3 announcements ordered by `createdAt`.
- For each announcement, the sidebar reads the associated `user/{userId}` document to show the announcer's name.

---

## 9. Testing & verification

Manual tests to run before demo:
- Register a new account. Verify a `user/{uid}` document appears in Firestore.
- Login with the account. Verify profile page shows the saved profile.
- Create an announcement document in Firestore (or use the app flow if implemented). Verify it appears in the sidebar in real time.
- Toggle an ad-blocker extension — verify that if requests are blocked the app logs `ERR_BLOCKED_BY_CLIENT` in the console.

Automated tests: none included in this repository; consider adding unit/component tests with `vitest` or `jest` and React Testing Library for critical components.

---

## 10. Security and production notes

- Never commit your Firebase Admin SDK private keys to source control.
- For production, restrict API keys with appropriate browser referrers and enable stricter Firestore rules.
- Limit who can write announcements (use custom claims or an `admins` collection + rules).

---

## 11. Future improvements (ideas to discuss with professor)

- Add role-based access control (admins vs residents) and secure announcement creation.
- Add input validation and server-side rules to prevent malformed `createdAt` or fake `userId` values.
- Add unit tests and end-to-end tests (Cypress) for the main flows.
- Improve UX: skeleton loaders, better error pages, and offline caching for announcements.
- Add audit logging for critical actions.

---

## 12. How to explain this to your professor (short script)

- "This is a React single-page app that uses Firebase for authentication and Firestore as a realtime database. The app demonstrates user registration/login, persistent user profiles, and realtime announcements. The frontend uses Vite and Tailwind for quick development and styling. Security is provided by Firestore rules that restrict reads/writes to authenticated users and to owners of user documents. During development we handled common issues like blocked network calls (browser extensions) and incorrect Firebase configuration."

---

## 13. Where to look in the code during the demo

- `src/Register.jsx` — show the sign-up flow and `setDoc` to Firestore.
- `src/Login.jsx` — show sign-in logic.
- `src/components/Profile/Profilepage.jsx` — show fetching and updating user data.
- `src/components/Rightsidebar.jsx` — show how realtime announcements are listened for and displayed.
- `src/firebase.jsx` — show Firebase initialization and explain config values.

---

## 14. Files added by me (debugging)

During debugging we added console logging and more robust error handling to `src/components/Rightsidebar.jsx` and `src/components/Profile/Profilepage.jsx`. If you want, I can produce a short changelog for the professor showing those commits.

---

## 15. Contact / References

- Firebase docs: https://firebase.google.com/docs
- Firestore rules: https://firebase.google.com/docs/firestore/security/get-started
- React + Vite: https://vitejs.dev/guide/


---

_End of report_
