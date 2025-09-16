import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: (import.meta as any).env.VITE_FB_API_KEY,
  authDomain: (import.meta as any).env.VITE_FB_AUTH_DOMAIN,
  projectId: (import.meta as any).env.VITE_FB_PROJECT_ID,
  storageBucket: (import.meta as any).env.VITE_FB_STORAGE_BUCKET,
  messagingSenderId: (import.meta as any).env.VITE_FB_MESSAGING_SENDER_ID,
  appId: (import.meta as any).env.VITE_FB_APP_ID,
};

export function ensureFirebase() {
  if (!getApps().length) initializeApp(firebaseConfig as any);
  return { app: getApps()[0], auth: getAuth(), db: getFirestore() };
}

export async function signInWithGoogle() {
  const { auth } = ensureFirebase();
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
}

export async function signOutAll() {
  const { auth } = ensureFirebase();
  await signOut(auth);
}

