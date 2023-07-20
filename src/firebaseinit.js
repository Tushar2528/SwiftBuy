// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJejeykZcRy-wTMEY-rbj_DzdnyEaENjc",
  authDomain: "blogging-app-1ad13.firebaseapp.com",
  projectId: "blogging-app-1ad13",
  storageBucket: "blogging-app-1ad13.appspot.com",
  messagingSenderId: "614345618530",
  appId: "1:614345618530:web:dc613ef1c8c47c9c8acd3b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


