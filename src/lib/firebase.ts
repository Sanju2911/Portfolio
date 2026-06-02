import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzRrhQvflTtgI_H92tCjYRBuUH8SGonIc",
  authDomain: "portfolio-0129.firebaseapp.com",
  projectId: "portfolio-0129",
  storageBucket: "portfolio-0129.firebasestorage.app",
  messagingSenderId: "693543066534",
  appId: "1:693543066534:web:c300a66616784a2b8f4d67",
  measurementId: "G-GR610380JZ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
