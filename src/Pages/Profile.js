import React, { useContext, useState } from "react";
import { UserContext } from "../App";
import avatar from "../assets/avatar.jpg";
import "../Profile.css";
// import { updateProfile, updateEmail, updatePassword } from "firebase/auth";
// import {
//   ref as storageRef,
//   uploadBytes,
//   getDownloadURL,
// } from "firebase/storage";

// all the private info. Lock it with a lock!

export default function Profile() {
  const user = useContext(UserContext);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [gender, setGender] = useState(user.gender);
  const [weight, setWeight] = useState(user.weight);
  const [height, setHeight] = useState(user.height);
  const [age, setAge] = useState(user.age);

  // jaelyn: render for big screens

  return (
    <div>
      {/* TOP SECTION */}
      <div className="header">
        <h2 style={{ marginBottom: "auto" }}>Profile</h2>
        <p style={{ marginTop: "auto" }}>
          Update your photo and personal details
        </p>
        <div className="container">
          <div className="inner-container">
            <img src={avatar} alt="avatar" width="100%" />
          </div>
        </div>
        <div className="displaytext">
          <div style={{ fontWeight: "600" }}>Display Photo</div>
          <div style={{ fontSize: "0.8rem" }}>
            This will be displayed on your profile page
          </div>
        </div>
        <div style={{ alignSelf: "center", margin: "0 0 1rem 5rem" }}>
          <input type="file" />
        </div>
        <div style={{ alignSelf: "center" }}>
          <button className="update-button">update</button>
          <button className="delete-button">delete</button>
        </div>

        {/* BODY */}
        <div>
          <br />
          <table
            style={{
              fontSize: "0.9rem",
              margin: "auto",
            }}
          >
            <tr className="height">
              <td style={{ width: "8rem" }}>Display Name:</td>
              <td>
                <input className="profile-inputs" type="text" value={name} />
              </td>
            </tr>

            <tr className="height">
              <td>Email</td>
              <td>
                <input className="profile-inputs" type="text" value={email} />
              </td>
            </tr>

            <tr className="height">
              <td>Age</td>
              <td>
                <input className="profile-inputs" type="text" value={age} />
              </td>
            </tr>

            <tr className="height">
              <td>Height (in cm)</td>
              <td>
                <input className="profile-inputs" type="text" value={height} />
              </td>
            </tr>

            <tr className="height">
              <td>Weight (in kg)</td>
              <td>
                <input className="profile-inputs" type="text" value={weight} />
              </td>
            </tr>

            <tr className="height">
              <td>Gender</td>
              <td>
                <input className="profile-inputs" type="text" value={gender} />
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
}
