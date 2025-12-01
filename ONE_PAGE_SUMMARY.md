# Domas — One-Page Summary

Quick notes you can say in a demo (one-minute explanation):

- Domas is a React single-page app using Firebase for authentication and Firestore as a realtime database.
- Key user flows:
  - Registration: frontend calls `createUserWithEmailAndPassword`, then writes a `user/{uid}` document to Firestore.
  - Login: frontend uses `signInWithEmailAndPassword`; `useAuthState(auth)` keeps the UI in sync.
  - Profile: frontend reads/writes `user/{uid}` via `getDoc` and `updateDoc`.
  - Announcements: right sidebar uses `onSnapshot` to listen to the latest announcements and updates in real time.

- Important files:
  - `src/firebase.jsx` — Firebase initialization (`auth`, `db`).
  - `src/Register.jsx` — sign-up and initial Firestore write.
  - `src/components/Profile/Profilepage.jsx` — profile read/update.
  - `src/components/Rightsidebar.jsx` — user details and realtime announcements listener.

- Security:
  - Firestore rules ensure users can only read/write their own profile (`request.auth.uid == uid`).
  - Announcements should be readable by authenticated users; limit who can write (admins) in production.

- Debug tips:
  - Check the browser console for `Missing or insufficient permissions` (rules issue) or `net::ERR_BLOCKED_BY_CLIENT` (ad-blocker).
  - Verify `firebaseConfig` matches the Firebase Console.

- How to demo live:
  1. Create a new account (show Firestore `user/{uid}` created).
  2. Open another browser session and create an announcement (or create it in Firestore console).
  3. Show the right sidebar updating in real time.

*End of one-page summary.*