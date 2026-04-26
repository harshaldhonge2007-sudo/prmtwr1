import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { getAnalytics, logEvent } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBy7jZ6GDJpP473h7ZyPt-UI_GeC_XwYsc", // Re-using your Gemini/GCP key if linked, or placeholder
  authDomain: "prmtwr1.firebaseapp.com",
  projectId: "prmtwr1",
  storageBucket: "prmtwr1.appspot.com",
  messagingSenderId: "844332838952",
  appId: "1:844332838952:web:final_version"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);
export const trackEvent = (name: string, params?: object) => {
  if (analytics) logEvent(analytics, name, params);
};

export { onAuthStateChanged, collection, addDoc, getDocs, serverTimestamp };

export const saveChatHistory = async (userId: string, message: string, reply: string) => {
  try {
    await addDoc(collection(db, "chatHistory"), {
      userId,
      question: message,
      answer: reply,
      timestamp: serverTimestamp()
    });
  } catch (e) {
    console.error("Error saving chat:", e);
  }
};
