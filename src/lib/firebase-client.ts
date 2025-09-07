
'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  projectId: 'careconnect-y08mv',
  appId: '1:228124441266:web:797d0635e31e25b8db27ab',
  storageBucket: 'careconnect-y08mv.appspot.com',
  apiKey: 'AIzaSyAan2aiKZXqjI-Pf8ccmR5BC6DS7qAw1R4',
  authDomain: 'careconnect-y08mv.firebaseapp.com',
  messagingSenderId: '228124441266',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);

// If you are running the local Firebase emulator, uncomment the lines below
// try {
//   connectFirestoreEmulator(db, 'localhost', 8080);
//   connectStorageEmulator(storage, 'localhost', 9199);
//   console.log("Connected to Firebase emulators");
// } catch (e) {
//   console.error(e);
// }

export { app, db, storage };
