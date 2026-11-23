import { initializeApp } from 'firebase/app';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore,
} from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import firebaseConfig from './firebase-applet-config.json';

// The app remains fully functional without Firebase (falls back to in-memory
// state). Once `firebase-applet-config.json` is populated with a real project,
// all data automatically syncs to Firestore and across devices.
export const isFirebaseConfigured: boolean = Boolean(
  firebaseConfig &&
    (firebaseConfig as { apiKey?: string }).apiKey &&
    (firebaseConfig as { projectId?: string }).projectId
);

export let db: Firestore = null as unknown as Firestore;
export let auth: Auth = null as unknown as Auth;

if (isFirebaseConfigured) {
  const app = initializeApp(firebaseConfig);
  db = initializeFirestore(
    app,
    {
      // Optional fields (e.g. `password: undefined` on Firebase Auth users) would
      // otherwise make every setDoc() call reject and the record never persist.
      ignoreUndefinedProperties: true,
      // Offline cache shared across tabs (replaces the deprecated
      // enableIndexedDbPersistence, which only worked in a single tab).
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
    },
    (firebaseConfig as { firestoreDatabaseId?: string }).firestoreDatabaseId
  );
  auth = getAuth(app);
}
