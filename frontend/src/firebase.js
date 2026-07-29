import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA16k5GOJZzr1JAu2SrOm3b1gBtxO_nBNA",
  authDomain: "agegate-72487.firebaseapp.com",
  projectId: "agegate-72487",
  storageBucket: "agegate-72487.firebasestorage.app",
  messagingSenderId: "537458423244",
  appId: "1:537458423244:web:b524b78c249e32aa0a9969"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
