import React, { useContext } from "react";
import { UserContext } from "../App";
// import { updateProfile, updateEmail, updatePassword } from "firebase/auth";
// import {
//   ref as storageRef,
//   uploadBytes,
//   getDownloadURL,
// } from "firebase/storage";
// import { TextField } from "@mui/material";

// all the private info. Lock it with a lock!

// J: currently the profile page is not rendering out age, name, height, weight & gender.

export default function Profile() {
  const user = useContext(UserContext);
  // J: i didn't pass password as props here - not sure if we should.

  return (
    <div>
      <h1>Profile Page!</h1>
      {/* J: added the following for testing purposes */}
      <p>Hello, {user.name}!</p>
      <p>Email: {user.email}</p>
      <p>Age: {user.age}</p>
      <p>Height: {user.height}</p>
      <p>Weight: {user.weight}</p>
      <p>Gender: {user.gender}</p>
    </div>
  );
}
