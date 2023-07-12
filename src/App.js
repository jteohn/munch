import React, { useState, useEffect } from "react";
import { auth } from "./firebase";
import { ref, set, onValue } from "firebase/database";
import { database } from "./firebase";
import {
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
// import "./App.css";

import MunchRoutes from "./Components/Routes";
import Navbar from "./Components/Navbar";

export const UserContext = React.createContext(null);
export const RecipeContext = React.createContext(null);

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState(null);
  const [age, setAge] = useState("");
  const [avatar, setAvatar] = useState("");
  const [dateSignedUp, setDateSignedUp] = useState("");
  const [uid, setUID] = useState("");
  //these for recipe context use
  const [compiledRecipeData, setCompiledRecipeData] = useState();

  const dataFromRecipe = (data) => {
    setCompiledRecipeData(data);
  };

  useEffect(() => {
    console.log(compiledRecipeData);
  }, [compiledRecipeData]);
  // for context use
  const currUser = {
    isLoggedIn: isLoggedIn,
    name: name,
    email: email,
    password: password,
    height: height,
    weight: weight,
    gender: gender,
    age: age,
    avatar: avatar,
    uid: uid,
  };

  //database key for userInfo ie name,height,weight etc
  const DB_USER_KEY = "userInfo/";

  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      //firebase authentication
      if (user) {
        const userID = user.uid;
        console.log(`user.uid:`, user.uid);
        // to ensure data is only called when user logs in, not when user signs up
        // if (isLogin === true ) {
        setUID(userID);
        const userRef = ref(database, DB_USER_KEY + userID);
        onValue(userRef, async (snapshot) => {
          let userData = await snapshot.val();
          // if user data exists in RTDB
          if (userData) {
            setIsLoggedIn(true);
            setStates(userData);
            // console.log(`updated setStates:`, userData);
          }
        });
      } else {
        console.log("user is signed out!");
        handleLogout("");
      }
    });
  }, [uid, isLoggedIn]);

  // to write user data to real time database on firebase on signup
  const writeData = (userID) => {
    const userListRef = ref(database, DB_USER_KEY + userID);
    set(userListRef, {
      userID: userID,
      name: name,
      dateSignedUp: new Date().toLocaleString(),
      email: email,
      height: height,
      weight: weight,
      gender: gender,
      age: age,
    });
  };

  // to set states of user fields, can be called from child by passing in function in route.js at that route element'
  // set as Promise to ensure fields are set before child calls other functions.
  const setStates = (user) => {
    return new Promise((resolve) => {
      setEmail(user.email);
      setAge(user.age);
      setHeight(user.height);
      setWeight(user.weight);
      setGender(user.gender);
      setName(user.name);
      setDateSignedUp(user.dateSignedUp);
      setUID(user.userID);
      setAvatar(user.avatar);
      if (user.password) {
        setPassword(user.password);
      }
      resolve();
    });
  };

  const handleSignup = () => {
    console.log(name, email, height, weight, gender, name);
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        const user = auth.currentUser;
        const userID = user.uid;
        setIsLoggedIn(true);
        setUID(userID);
        // update display name
        updateProfile(user, { displayName: name })
          .then(() => {
            console.log(`Display name has been updated successfully!`, name);
            // update RTDB with user info, currUser is our UserContext
            writeData(userID, currUser);
          })
          .catch((error) => {
            console.log(`Error: unable to update display name:`, error);
          });

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `Hello, ${name}! Welcome to munch, we are excited to have you here!`,
          showConfirmButton: false,
          timer: 5000,
        });
        // console.log(
        //   `Hello ${name}, ! Welcome to munch, we are excited to have you here!`
        // );

        navigate("/dashboard");
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "This email address has already been used!",
        });
        // console.log(
        //   `Unable to sign up! This email address has already been used!`,
        //   error
        // );
      });
  };

  const handleLogin = async (email, password) => {
    if (!email || !password) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please enter your email and password!",
      });
      // console.log(`Please enter your email and password!`);
      return;
    }
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      //alert(`Welcome back, ${email}`);
      console.log(user.user.displayName);
      setIsLoggedIn(true);
      // setIsLogin(true);
      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Invalid email or password. Please try again!",
      });
      // console.log("Invalid email or password. Please try again!");
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setIsLoggedIn(false);
        setName("");
        setEmail("");
        setWeight("");
        setHeight("");
        setGender("");
        setAge("");
        setPassword("");
        setUID("");
        setAvatar("");
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
      <UserContext.Provider value={currUser}>
        <RecipeContext.Provider value={compiledRecipeData}>
          <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
          <MunchRoutes
            handleSignup={handleSignup}
            handleLogin={handleLogin}
            setStates={setStates}
            dataFromRecipe={dataFromRecipe}
          />
        </RecipeContext.Provider>
      </UserContext.Provider>
    </div>
  );
}
