import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// PLACEHOLDER: The user should replace this with their actual config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSy_PLACEHOLDER",
  authDomain: "prmtwr1.firebaseapp.com",
  projectId: "prmtwr1",
  storageBucket: "prmtwr1.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Auth Helpers
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);

// Firestore Helpers
export const saveChatHistory = async (userId: string, message: string, reply: string) => {
  try {
    await addDoc(collection(db, "chats"), {
      userId,
      message,
      reply,
      timestamp: new Date()
    });
  } catch (e) {
    console.error("Error saving chat:", e);
  }
};
