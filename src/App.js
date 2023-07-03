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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [currUser, setCurrUser] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState(null);
  const [age, setAge] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [uid, setUID] = useState("");
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

  const DB_USER_KEY = "userInfo/";

  const navigate = useNavigate();

  const getUserInfo = async (userID) => {
    const userListRef = ref(database, `${DB_USER_KEY}/${userID}`);

    try {
      const snapshot = await get(userListRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        const objKey = Object.keys(userData);
        const curname = userData[`${objKey[0]}`].name;
        const curage = userData[`${objKey[0]}`].age;
        const curemail = userData[`${objKey[0]}`].email;
        const curheight = userData[`${objKey[0]}`].height;
        const curweight = userData[`${objKey[0]}`].weight;
        const curgender = userData[`${objKey[0]}`].gender;
        const userObj = {
          name: curname,
          age: curage,
          email: curemail,
          height: curheight,
          weight: curweight,
          gender: curgender,
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userID = user.uid;
        console.log(user);
        const userObj = await getUserInfo(userID);
        // const userInfoRef = usersRef.orderByChild("userID").equalTo(userID);
        setName(userObj.name);
        setEmail(userObj.email);
        setAge(userObj.age);
        setHeight(userObj.height);
        setWeight(userObj.weight);
        setGender(userObj.gender);
        setIsLoggedIn(true);
        setUID(userID);
        console.log(
          name,
          email,
          age,
          height,
          weight,
          gender,
          isLoggedIn,
          userID
        );
      } else {
        setIsLoggedIn(false);
        setName("");
      }
      setIsPageLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, [uid, name, email, age, height, weight, gender, isLoggedIn]);

  // to write user data to real time database on firebase
  const writeData = (userID, userObj) => {
    setUID(userID);
    setName(userObj.cuName);
    setEmail(userObj.cuEmail);
    setHeight(userObj.cuHeight);
    setWeight(userObj.cuWeight);
    setGender(userObj.cuGender);
    setAge(userObj.cuAge);
    console.log(userObj);
    const userListRef = ref(database, DB_USER_KEY + userID);
    const newUserRef = push(userListRef);
    set(newUserRef, {
      userID: userID,
      name: userObj.cuName,
      dateSignedUp: new Date().toLocaleString(),
      email: userObj.cuEmail,
      height: userObj.cuHeight,
      weight: userObj.cuWeight,
      gender: userObj.cuGender,
      age: userObj.cuAge,
    });
  };

  const handleSignup = (name, email, password, height, weight, gender, age) => {
    // J: verified. user info will be passed from signup.js to handleSignup function & stored in firebase auth.
    const userObj = {
      cuName: name,
      cuEmail: email,
      cuHeight: height,
      cuWeight: weight,
      cuGender: gender,
      cuPassword: password,
      cuAge: age,
    };

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        const user = auth.currentUser;
        const userID = user.uid;

        // update display name
        updateProfile(user, { displayName: name })
          .then(() => {
            console.log(`Display name has been updated successfully!`);
            console.log(userObj);
            //update Database with user info
            writeData(userID, userObj);
          })
          .catch((error) => {
            console.log(`Error updating display name.`, error);
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
      console.log(user.user.displayName);
      const displayName = user.user.displayName;
      setName(displayName);
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
      <UserContext.Provider value={currUser}>
        <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <MunchRoutes
          handleSignup={handleSignup}
          handleLogin={handleLogin}
          currUser={currUser}
        />
      </UserContext.Provider>
    </div>
  );
}
