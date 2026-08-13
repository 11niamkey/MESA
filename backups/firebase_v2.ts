import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from './firebase-applet-config.json';

// The app remains fully functional without Firebase (falls back to in-memory
// state). Once `firebase-applet-config.json` is populated with a real project,
// all data automatically syncs to Firestore and across devices.
export const isFirebaseConfigured: boolean = Boolean(
  firebaseConfig &&
    (firebaseConfig as { apiKey?: string }).apiKey &&
    (firebaseConfig as { projectId?: string }).projectId
);

let app;
export let db: any = null;
export let auth: any = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app, (firebaseConfig as { firestoreDatabaseId?: string }).firestoreDatabaseId);
  auth = getAuth(app);

  // Enable offline persistence
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support all of the features required to enable persistence');
    } else {
      console.warn('Firebase persistence error:', err);
    }
  });
}