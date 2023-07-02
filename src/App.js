import React, { useState, useEffect } from "react";
import { auth } from "./firebase";
import {
  // createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
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
  // const [currUser, setCurrUser] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState(null);
  const [age, setAge] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        setIsLoggedIn(true);
        setName(user.displayName);
      } else {
        setIsLoggedIn(false);
        setName("");
      }
      setIsPageLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleSignup = (name, email, password, height, weight, gender, age) => {
    // J: verified. user info will be passed from signup.js to handleSignup function & stored in firebase auth.
    console.log(
      (`name:`, name),
      (`email:`, email),
      (`height:`, height),
      (`weight:`, weight),
      (`gender:`, gender),
      (`age:`, age)
    );
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCred) => {
        const user = auth.currentUser;

        // update display name
        updateProfile(user, { displayName: name })
          .then(() => {
            console.log(`Display name has been updated successfully!`);
          })
          .catch((error) => {
            console.log(`Error updating display name.`, error);
          });

        // alert(`Hello, ${name}! Welcome to munch, we are excited to have you here!`)
        console.log(
          `Hello ${name}, ! Welcome to munch, we are excited to have you here!`
        );

        setName("");
        setEmail("");
        setPassword("");
        setHeight("");
        setWeight("");
        setGender(null);
        setAge("");
        // J: testing to see if re-routing works!
        navigate("/dashboard");
      })
      .catch((error) => {
        // J: min requirement for pw length?
        // alert(`Username is taken, please try another one!`)
        console.log(`Username is taken, please try another one!`);
      });
  };

  // J: verified. existing user can now sign in + redirected to home page upon signing in.
  const handleLogin = async (email, password) => {
    if (!email || !password) {
      //alert(`Please enter your email and password!`);
      console.log(`Please enter your email and password!`);
      return;
    }
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      //alert(`Welcome back, ${email}`);
      console.log(`Welcome back, ${email}`);
      console.log(`user:`, user);

      setEmail("");
      setPassword("");
      navigate("/");
    } catch (error) {
      //alert('Invalid email or password. Please try again!');
      console.log("Invalid email or password. Please try again!");
    }
  };

  // J: tested & verified. logout function is working.
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setIsLoggedIn(false);
        setName("");
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
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <MunchRoutes
        handleSignup={handleSignup}
        handleLogin={handleLogin}
        isLoggedIn={isLoggedIn}
        name={name}
        email={email}
        password={password}
        height={height}
        weight={weight}
        gender={gender}
        age={age}
        isPageLoading={isPageLoading}
      />
    </div>
  );
}
