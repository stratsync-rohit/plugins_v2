import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDxiFC6N73x1vJQrYfGND7tqQ00WdnlJT0",
  authDomain: "stratsync-extension-ebff2.firebaseapp.com",
  projectId: "stratsync-extension-ebff2",
  storageBucket: "stratsync-extension-ebff2.firebasestorage.app",
  messagingSenderId: "876513410741",
  appId: "1:876513410741:web:6aa24dc3e6b85290e508fc",
  measurementId: "G-5087H8B6R2"
};

const app: FirebaseApp = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);


