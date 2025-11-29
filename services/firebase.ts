import { initializeApp, getApps, getApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getAuth, Auth, User } from 'firebase/auth';
import { getFirestore, Firestore, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const FIREBASE_CONFIG_KEY = 'firebaseConfig';

// Default config is now a placeholder to force users to input their own
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyD2E6g4hoiebYtXjhip7D5h2cx3TxPILCE",
  authDomain: "stylemate-e534e.firebaseapp.com",
  projectId: "stylemate-e534e",
  storageBucket: "stylemate-e534e.firebasestorage.app",
  messagingSenderId: "903619554394",
  appId: "1:903619554394:web:ce1fa8871bf1fe6e52bc63",
  measurementId: "G-SGYZSQ7V0B"
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let isFirebaseConfigured = false;

// Helper to get config
const getConfig = () => {
    try {
        const configJson = localStorage.getItem(FIREBASE_CONFIG_KEY);
        if (configJson) return JSON.parse(configJson);
    } catch (e) {
        console.error("Config parse error", e);
    }
    return DEFAULT_FIREBASE_CONFIG;
};

const firebaseConfig = getConfig();

// Initialize Firebase
if (firebaseConfig && firebaseConfig.apiKey && firebaseConfig.apiKey !== "FIREBASE_CONFIG_NOT_SET") {
    if (!getApps().length) {
        app = initializeApp(firebaseConfig);
    } else {
        app = getApp();
    }
    isFirebaseConfigured = true;
} else {
    // Dummy initialization to prevent crash on load if config is missing
    if (!getApps().length) {
         app = initializeApp({ 
            apiKey: "FIREBASE_CONFIG_NOT_SET", 
            authDomain: "example.firebaseapp.com", 
            projectId: "example-project" 
        });
    } else {
        app = getApp();
    }
    isFirebaseConfigured = false;
}

auth = getAuth(app);
db = getFirestore(app);
storage = getStorage(app);

export const setFirebaseConfig = (config: object): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(config));
      // Reload the page to re-initialize with the new config
      window.location.reload();
      resolve();
    } catch (e) {
      console.error("Failed to save Firebase config to localStorage", e);
      reject(e);
    }
  });
};

export const testFirestoreConnection = async (collectionName: string) => {
  try {
    const testDoc = doc(db, collectionName, 'test-connection');
    await setDoc(testDoc, { connectedAt: serverTimestamp() }, { merge: true });
    console.log(`Firestore connection to '${collectionName}' successful.`);
  } catch (error) {
    console.error(`Firestore connection to '${collectionName}' failed:`, error);
    throw error;
  }
};

export const ensureUserDocument = async (user: User) => {
  if (!user) return null;
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    // Create basic profile if it doesn't exist
    await setDoc(userRef, {
        firebaseUid: user.uid,
        email: user.email,
        name: user.displayName || user.email?.split('@')[0] || 'User',
        avatar: user.photoURL || 'https://picsum.photos/seed/default/100/100',
        createdAt: serverTimestamp(),
    });
    return await getDoc(userRef);
  }
  return userSnap;
};

export { app, auth, db, storage, isFirebaseConfigured };