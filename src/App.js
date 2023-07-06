import React, { useState, useEffect } from "react";
import { auth } from "./firebase";
import { push, ref, set, get } from "firebase/database";
import { database } from "./firebase";
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

export const UserContext = React.createContext(null);

export default function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState(null);
  const [age, setAge] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [uid, setUID] = useState("");
  const [isLogin, setIsLogin] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
    isPageLoading: isPageLoading,
    uid: uid,
  };

  //database key for userInfo ie name,height,weight etc
  const DB_USER_KEY = "userInfo/";

  const navigate = useNavigate();

  // getting user info from database upon login
  const getUserInfo = async (userID) => {
    const userListRef = ref(database, `${DB_USER_KEY}/${userID}`);

    try {
      const snapshot = await get(userListRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        const objKey = Object.keys(userData);
        const name = userData[`${objKey[0]}`].name;
        const age = userData[`${objKey[0]}`].age;
        const email = userData[`${objKey[0]}`].email;
        const height = userData[`${objKey[0]}`].height;
        const weight = userData[`${objKey[0]}`].weight;
        const gender = userData[`${objKey[0]}`].gender;
        const userObj = {
          name: name,
          age: age,
          email: email,
          height: height,
          weight: weight,
          gender: gender,
        };
        console.log(userObj);
        return userObj;
      } else {
        console.log("User not found");
      }
    } catch (error) {
      console.log("Error retrieving user info : ", error);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      console.log(`onAuthStateChanged triggered`);
      if (user) {
        console.log(`onAuthStateChanged user`, user);
        const userID = user.uid;
        console.log(user.uid);
        setIsLoggedIn(true);

        // to ensure data is only called when user logs in, not when user signs up
        if (isLogin === true) {
          let userObj = await getUserInfo(user.uid);
          if (
            typeof userObj === "undefined" &&
            !userObj.email &&
            !userObj.age &&
            !userObj.weight &&
            !userObj.gender &&
            !userObj.name
          ) {
            await getUserInfo(user.uid); // waits for database if not all fields of userObj are formed
            // jae to check if userInfo loaded?`)
          } else {
            setUID(userID);
            setStates(userObj); // set states after values are retrieved from database for login
            setIsLoggedIn(true);
          }
        }
      }
      setIsPageLoading(false);
    });
  }, [uid, name, age, gender, email, height, weight, isLogin]);

  // to write user data to real time database on firebase on signup
  const writeData = (userID) => {
    const userListRef = ref(database, DB_USER_KEY + userID);
    const newUserRef = push(userListRef);
    set(newUserRef, {
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
  const setStates = (userObj) => {
    return new Promise((resolve) => {
      setEmail(userObj.email);
      setAge(userObj.age);
      setHeight(userObj.height);
      setWeight(userObj.weight);
      setGender(userObj.gender);
      setName(userObj.name);
      if (userObj.password) {
        setPassword(userObj.password);
      }
      resolve();
    });
  };

  const handleSignup = () => {
    // J: verified. user info will be passed from signup.js to handleSignup function & stored in firebase auth.
    // update 6 jul: setIsLogin(false); to prevent useEffect onAuthStateChange activating getinfo from database for signup
    console.log(name, email, height, weight, gender, name);
    // onAuthStateChanged is triggered here
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        const user = auth.currentUser;
        const userID = user.uid;
        // update 6 jul: setIsLoggedIn(true);
        setUID(userID);
        // update display name
        updateProfile(user, { displayName: name })
          .then(() => {
            console.log(`Display name has been updated successfully!`);
            //update Database with user info
            writeData(userID, currUser);
          })
          .catch((error) => {
            console.log(`Error : `, error);
          });

        // alert(`Hello, ${name}! Welcome to munch, we are excited to have you here!`)
        console.log(
          `Hello ${name}, ! Welcome to munch, we are excited to have you here!`
        );

        // J: testing to see if re-routing works!
        navigate("/dashboard");
      })
      .catch((error) => {
        // J: min requirement for pw length?
        // alert(`Username is taken, please try another one!`)
        console.log(`Error: `, error);
      });
  };

  const handleLogin = async (email, password) => {
    if (!email || !password) {
      //alert(`Please enter your email and password!`);
      console.log(`Please enter your email and password!`);
      return;
    }
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      //alert(`Welcome back, ${email}`);
      console.log(user.user.displayName);
      setIsLoggedIn(true);
      setIsLogin(true);
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
        setIsLogin(null);
        setEmail("");
        setWeight("");
        setHeight("");
        setGender("");
        setAge("");
        setPassword("");
        setIsPageLoading(true);
        setUID("");
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
        <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <MunchRoutes
          handleSignup={handleSignup}
          handleLogin={handleLogin}
          setStates={setStates}
        />
      </UserContext.Provider>
    </div>
  );
}
