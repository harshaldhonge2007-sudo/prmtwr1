import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { getAnalytics, logEvent, type Analytics } from 'firebase/analytics';

/**
 * Firebase configuration for ElecGuide.
 * All sensitive values are scoped to this project (prmtwr1).
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBy7jZ6GDJpP473h7ZyPt-UI_GeC_XwYsc',
  authDomain: 'prmtwr1.firebaseapp.com',
  projectId: 'prmtwr1',
  storageBucket: 'prmtwr1.appspot.com',
  messagingSenderId: '844332838952',
  appId: '1:844332838952:web:abc123elecguide000000',
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Firestore
export const db = getFirestore(app);

// Analytics (client-side only)
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch {
    // Analytics may not be available in all environments
  }
}

// ---- Auth helpers ----
export const signInWithGoogle = (): Promise<void> =>
  signInWithPopup(auth, googleProvider).then(() => undefined);

export const logout = (): Promise<void> => signOut(auth);

// ---- Analytics helpers ----
export const trackEvent = (name: string, params?: Record<string, unknown>): void => {
  if (analytics) logEvent(analytics, name, params);
};

// ---- Firestore helpers ----
/**
 * Save a chat Q&A pair to Firestore for the authenticated user.
 */
export const saveChatHistory = async (
  userId: string,
  message: string,
  reply: string
): Promise<void> => {
  try {
    await addDoc(collection(db, 'chatHistory'), {
      userId,
      question: message,
      answer: reply,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Firestore error saving chat history:', error);
  }
};

// Re-export auth listener for use in components
export { onAuthStateChanged, collection, addDoc, serverTimestamp };
