# Backend Data Flow — ASCII Diagrams

This file contains simple ASCII sequence diagrams illustrating the main flows described in `BACKEND_DATA_FLOW.md`.

## 1) Registration and user document write

```
User -> Frontend: fills registration form
Frontend -> Firebase Auth (Identity Toolkit): createUserWithEmailAndPassword
Firebase Auth -> Frontend SDK: returns uid + idToken
Frontend -> Firestore (REST/gRPC): setDoc(doc(db,'user', uid), { profile })
Firestore -> Frontend: write success (enforced by rules)
```

## 2) Page load — read profile and attach announcements listener

```
Frontend (on mount) -> Firebase SDK: check auth.currentUser / useAuthState
Frontend -> Firestore: getDoc(doc(db,'user', uid))
Firestore -> Frontend: user document (if permitted by rules)

Frontend -> Firestore: onSnapshot(query(collection('announcements'), orderBy('createdAt', 'desc'), limit(3)))
Firestore (realtime channel) -> Frontend: initial QuerySnapshot
Frontend: update React state and render announcements

-- Later --
OtherClient -> Firestore: addDoc(collection('announcements'), {content, userId, createdAt})
Firestore -> All listeners: push updated QuerySnapshot
Frontend SDK: invoke onSnapshot callback -> update state -> UI updates live
```

## Notes
- All Firestore and Auth calls are authenticated by the SDK using the user's ID token.
- Security rules are evaluated on the server; insufficient rules result in `permission-denied` errors.
- Realtime listeners can use gRPC-web or WebChannel depending on the environment; the SDK abstracts this.

*End of diagram file.*