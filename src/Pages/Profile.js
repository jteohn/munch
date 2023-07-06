import React, { useContext, useState } from "react";
import { UserContext } from "../App";
import "../Profile.css";
import { Box, Button, Modal, useMediaQuery } from "@mui/material";

import { ref as databaseRef, get, set } from "firebase/database";
import {
  getDownloadURL,
  uploadBytes,
  ref as storageRef,
} from "firebase/storage";
import { database, auth, storage } from "../firebase";

// import { updateProfile, updateEmail, updatePassword } from "firebase/auth";
// all the private info. Lock it with a lock!

export default function Profile() {
  const user = useContext(UserContext);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  // const [editEmail, setEditEmail] = useState(user.email);
  const [editWeight, setEditWeight] = useState("");
  const [editHeight, setEditHeight] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editGender, setEditGender] = useState("");

  const [avatarFile, setAvatarFile] = useState("");
  const [avatarValue, setAvatarValue] = useState("");

  const DB_USER_KEY = "userInfo/";
  const STORAGE_AVATAR_KEY = "avatar/";
  // const storage = getStorage();

  const handleOpenModal = () => {
    setOpenEditModal(true);
  };

  const handleCloseModal = () => {
    setEditName("");
    setEditWeight("");
    setEditHeight("");
    setEditAge("");
    setEditGender("");
    setOpenEditModal(false);
  };

  // save user updated info
  const handleSaveProfile = () => {};

  // allow user to upload profile picture
  const handleAvatar = (e) => {
    setAvatarFile(e.target.files[0]);
    setAvatarValue(e.target.files);
  };

  const handleSubmitAvatar = (e) => {
    e.preventDefault();

    // if user uploads a profile picture
    if (avatarFile.name !== "") {
      console.log(`this is filepath: `, avatarFile);
      console.log(`this is filevalue: `, avatarValue);

      // const storageFileName = STORAGE_AVATAR_KEY + avatarFile.name;
      const avatarStorageRef = storageRef(
        storage,
        STORAGE_AVATAR_KEY + avatarFile.name
      );
      uploadBytes(avatarStorageRef, avatarFile).then((snapshot) => {
        getDownloadURL(avatarStorageRef, avatarFile.name).then((url) => {
          console.log(`getDownloadURL filename:`, avatarFile.name);
          const currentUser = auth.currentUser;
          console.log(`currentUser:`, currentUser);

          writeData(url, avatarStorageRef, currentUser);
          console.log(`Avatar updated`);
          setAvatarFile("");
          setAvatarValue("");
        });
      });
    } else {
      const storageFileName = STORAGE_AVATAR_KEY + "defaultAvatar.jpg";
      getDownloadURL(storageFileName, "defaultAvatar.jpg").then((url) => {
        console.log(`picture set to default avatar`, url);
      });
    }
  };

  const writeData = (url, avatarStorageRef, currentUser) => {
    const userID = user.uid;
    const userRef = databaseRef(database, `${DB_USER_KEY}/${userID}/avatar`);

    // get existing user info from database
    get(userRef)
      .then((snapshot) => {
        const userData = snapshot.val();

        // update database with avatar url
        const updatedUserData = {
          ...userData,
          avatar: url,
        };

        // save updated user info to RTDB
        set(userRef, updatedUserData)
          .then(() => {
            console.log("Profile picture updated successfully.");
            // update avatarFile state with the url
            setAvatarFile(url);
          })
          .catch((error) => {
            console.log("Error updating profile picture:", error);
          });
      })
      .catch((error) => {
        console.log("Error retrieveing user information:", error);
      });
  };

  const renderTable = (
    <div>
      <table
        style={{
          fontSize: "0.9rem",
          margin: "auto",
        }}
      >
        <tr className="rowHeight">
          <td style={{ width: "8rem" }}>Display Name:</td>
          <td>
            <input
              className="updateProfile"
              type="text"
              defaultValue={user.name}
              onChange={(e) => setEditName(e.target.value)}
            />
          </td>
        </tr>

        <tr className="rowHeight">
          <td>Age</td>
          <td>
            <input
              className="updateProfile"
              type="text"
              defaultValue={user.age}
              onChange={(e) => setEditAge(e.target.value)}
            />
          </td>
        </tr>

        <tr className="rowHeight">
          <td>Gender</td>
          <td>
            <input
              className="updateProfile"
              type="text"
              defaultValue={user.gender}
              onChange={(e) => setEditGender(e.target.value)}
            />
          </td>
        </tr>

        <tr className="rowHeight">
          <td>Height (in cm)</td>
          <td>
            <input
              className="updateProfile"
              type="text"
              defaultValue={user.height}
              onChange={(e) => setEditHeight(e.target.value)}
            />
          </td>
        </tr>

        <tr className="rowHeight">
          <td>Weight (in kg)</td>
          <td>
            <input
              className="updateProfile"
              type="text"
              defaultValue={user.weight}
              onChange={(e) => setEditWeight(e.target.value)}
            />
          </td>
        </tr>
      </table>
      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
        <button className="saveButton font">Save</button>
      </div>
    </div>
  );

  const isLargeScreen = useMediaQuery("(min-width: 800px)");
  const renderTableforLgScreen = (
    <div>
      <table
        style={{
          fontSize: "1rem",
          margin: "2.5rem auto 0rem auto",
        }}
      >
        <tr className="rowHeight">
          <td style={{ width: "7.5rem" }}>Display Name:</td>
          <td>
            <input
              className="updateProfile large"
              style={{ width: "29rem" }}
              type="text"
              defaultValue={user.name}
              onChange={(e) => setEditName(e.target.value)}
            />
          </td>
        </tr>
      </table>

      <table
        style={{
          fontSize: "1rem",
          margin: "0.5rem auto 2.5rem auto",
        }}
      >
        <tr className="rowHeight">
          <td style={{ width: "6rem" }}>Age</td>
          <td>
            <input
              className="updateProfile large"
              type="text"
              defaultValue={user.age}
              onChange={(e) => setEditAge(e.target.value)}
            />
          </td>
          <td>Gender</td>
          <td>
            <input
              className="updateProfile large"
              type="text"
              defaultValue={user.gender}
              onChange={(e) => setEditGender(e.target.value)}
            />
          </td>
        </tr>

        <tr className="rowHeight">
          <td>Height (in cm)</td>
          <td>
            <input
              className="updateProfile large"
              type="text"
              defaultValue={user.height}
              onChange={(e) => setEditHeight(e.target.value)}
            />
          </td>
          <td>Weight (in kg)</td>
          <td>
            <input
              className="updateProfile large"
              type="text"
              defaultValue={user.weight}
              onChange={(e) => setEditWeight(e.target.value)}
            />
          </td>
        </tr>
      </table>
      <div style={{ textAlign: "center" }}>
        <button className="saveButton font">Save</button>
      </div>
    </div>
  );

  return (
    <div>
      {/* TOP SECTION */}
      <div className="header">
        <div
          style={{
            textAlign: "center",
            margin: window.innerWidth > 1100 ? "2rem" : "auto",
          }}
        >
          <h2 style={{ marginBottom: "auto" }}>Hello, {user.name}!</h2>
          <p style={{ marginTop: "auto" }}>
            Update your photo and personal details here
          </p>
        </div>
        <div className="container">
          <div className="inner-container">
            {avatarFile && <img src={avatarFile} alt="avatar" width="100%" />}
          </div>
        </div>
        <div className="displaytext">
          <div style={{ fontWeight: "600" }}>Display Photo</div>
          <div style={{ fontSize: "0.8rem" }}>
            This will be displayed on your profile page
          </div>
        </div>
        <div style={{ alignSelf: "center", margin: "0 0 1rem 5rem" }}>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleAvatar}
          />
        </div>
        <div style={{ alignSelf: "center" }}>
          <button className="update-button" onClick={handleSubmitAvatar}>
            update
          </button>
          <button className="delete-button">delete</button>
        </div>

        {/* BODY */}
        <div>
          <Button onClick={handleOpenModal}>Edit Profile</Button>
          <Modal
            open={openEditModal}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{
              width: "80%",
              p: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "auto",
            }}
          >
            <Box
              sx={{
                width: "50rem",
                height: "30rem",
                p: 2,
                backgroundColor: "#EFE9E0",
                borderRadius: 5,
              }}
            >
              <h2
                className="font"
                style={{
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                Edit Profile
              </h2>
              {isLargeScreen ? renderTableforLgScreen : renderTable}
            </Box>
          </Modal>
        </div>

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
              <td>{user.name}</td>
            </tr>

            <tr className="height">
              <td>Age</td>
              <td>{user.age}</td>
            </tr>

            <tr className="height">
              <td>Height (in cm)</td>
              <td>{user.height}</td>
            </tr>

            <tr className="height">
              <td>Weight (in kg)</td>
              <td>{user.weight}</td>
            </tr>

            <tr className="height">
              <td>Gender</td>
              <td>{user.gender}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
}

// jaelyn: render for big screens
// add a breakpoint for large screen to render 60% width for modal
