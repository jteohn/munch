// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TODO: Replace with your app's Firebase project configuration
// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   // The value of `databaseURL` depends on the location of the database
//   databaseURL: process.env.REACT_APP_DATABASE_URL,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_APP_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyD0vRC17IitXLwshDy3gkX0cKQX2BDEeGI",
  authDomain: "munch-m.firebaseapp.com",
  databaseURL: "https://munch-m-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "munch-m",
  storageBucket: "munch-m.appspot.com",
  messagingSenderId: "325470183132",
  appId: "1:325470183132:web:82db415f8bc49552045e19"
};


// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the database service and export the reference for other modules
export const database = getDatabase(firebaseApp);
export const storage = getStorage(firebaseApp);
export const auth = getAuth(firebaseApp);
