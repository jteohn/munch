import React from "react";
// import "./App.css";
// import { auth } from "./firebase";
// import {
//   signOut,
//   onAuthStateChanged,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   updateProfile,
// } from "firebase/auth";

// I'm guessing main functions can all be put here. ie login logout etc

import MunchRoutes from "./Components/Routes";
import Navbar from "./Components/Navbar";

export default function App() {
  return (
    <div className="App">
      <header className="App-header"></header>
      {/* other codes here? or in body? */}
      <Navbar />
      <MunchRoutes />
    </div>
  );
}
