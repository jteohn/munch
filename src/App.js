import React, { useState, useEffect } from "react";
import { auth } from "./firebase";
import {
  // createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  // updateProfile,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
// import "./App.css";

// I'm guessing main functions can all be put here. ie login logout etc
// Jaelyn: ok! i will add them here!

import MunchRoutes from "./Components/Routes";
import Navbar from "./Components/Navbar";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currUser, setCurrUser] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        setIsLoggedIn(true);
        setCurrUser(user);
      } else {
        setIsLoggedIn(false);
        setCurrUser({});
      }
    });
  }, []);

  const handleLogin = async () => {
    if ((email === "") | (password === "")) {
      //alert(`Please enter your email and password!`);
      console.log(`Please enter your email and password!`);
      return;
    }
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      //alert(`Welcome back, ${email}`);
      console.log(`user:`, user);
      setEmail("");
      setPassword("");
      navigate("/home");
    } catch (error) {
      //alert('Invalid email or password. Please try again!');
      console.log("Invalid email or password. Please try again!");
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setIsLoggedIn(false);
        setCurrUser({});
        console.log(`Successfully logout from Munch!`);
      })
      .catch((error) => {
        console.log(`Error logging out:`, error);
      });
  };

  return (
    <div className="App">
      <header className="App-header"></header>
      {/* other codes here? or in body? */}
      <Navbar handleLogin={handleLogin} handleLogout={handleLogout} />
      <MunchRoutes currUser={currUser.email} isLoggedIn={isLoggedIn} />
    </div>
  );
}
