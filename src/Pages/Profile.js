import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../App";
import defaultAvatar from "../assets/defaultAvatar.png";
import "../Profile.css";
import { Box, Modal, useMediaQuery } from "@mui/material";
import Swal from "sweetalert2";

import { ref as databaseRef, update } from "firebase/database";
import {
  getDownloadURL,
  uploadBytes,
  ref as storageRef,
  deleteObject,
} from "firebase/storage";
import { database, storage } from "../firebase";

// all the private info. Lock it with a lock!

export default function Profile(props) {
  const user = useContext(UserContext);
  const { setStates } = props;

  const [openEditModal, setOpenEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editWeight, setEditWeight] = useState("");
  const [editHeight, setEditHeight] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editGender, setEditGender] = useState("");
  const [avatarFile, setAvatarFile] = useState("");

  // Add fileInputRef to clear the file input field after user has uploaded profile picture
  const fileInputRef = useRef(null);

  const DB_USER_KEY = "userInfo/";
  const STORAGE_AVATAR_KEY = "avatar/";

  // ===== MODAL ===== //
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

  // ===== USER UPDATE PERSONAL INFORMATION ===== //
  const handleSaveProfile = () => {
    const userID = user.uid;
    const userRef = databaseRef(database, `${DB_USER_KEY}/${userID}`);

    // Prepare the updated user data
    const updatedUser = {
      name: editName || user.name,
      age: editAge || user.age,
      height: editHeight || user.height,
      weight: editWeight || user.weight,
      gender: editGender || user.gender,
    };

    // Update the user data in RTDB
    update(userRef, updatedUser)
      .then(() => {
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Success!",
          text: "Your profile has been updated!",
        });

        // Update the user object in state (fyi user is from useContext)
        const updatedUserObj = { ...user, ...updatedUser };
        setStates(updatedUserObj);

        // Close the edit modal
        handleCloseModal();
      })
      .catch((error) => {
        console.log("Error updating profile:", error);
      });
  };

  // ===== USER UPDATE/UPLOAD PROFILE PICTUE ===== //
  const handleAvatar = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const handleSubmitAvatar = (e) => {
    e.preventDefault();

    // If user uploads a profile picture
    if (avatarFile) {
      const avatarStorageRef = storageRef(
        storage,
        STORAGE_AVATAR_KEY + avatarFile.name
      );
      uploadBytes(avatarStorageRef, avatarFile).then((snapshot) => {
        getDownloadURL(avatarStorageRef, avatarFile.name).then((url) => {
          // console.log(`getDownloadURL filename:`, avatarFile.name);
          writeData(url);
          // console.log(`Avatar updated`);
          setAvatarFile("");
          Swal.fire({
            position: "top-center",
            icon: "success",
            title: "Success!",
            text: "Your profile picture has been updated!",
          });

          // To clear the file input field.
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        });
      });
    }
  };

  // To render the user's avatar picture
  useEffect(() => {
    if (user.avatar) {
      setAvatarFile(user.avatar);
    }
  }, [user.avatar]);

  // ===== STORING PROFILE PICTUE IN RTDB ===== //
  const writeData = (url) => {
    const userID = user.uid;
    const userRef = databaseRef(database, `${DB_USER_KEY}/${userID}`);

    // update avatar URL in RTDB
    update(userRef, { avatar: url })
      .then(() => {
        console.log("Profile picture updated successfully.");
        // update avatarFile state with the url
        setAvatarFile(url);
        // update user object with the new avatar url
        setStates({ ...user, avatar: url });
      })
      .catch((error) => {
        console.log("Error updating profile picture:", error);
      });
  };

  // ===== USER DELETE PROFILE PICTURE ===== //
  const handleDelete = (url) => {
    // User to confirm before deleting
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAvatarImage();
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };

  // ===== DELETE PROFILE PICTURE IN RTDB & STORAGE ===== //
  const deleteAvatarImage = () => {
    if (user.avatar !== undefined) {
      const currentAvatar = user.avatar;
      const currentAvatarRef = storageRef(storage, currentAvatar);
      deleteObject(currentAvatarRef)
        .then(() => console.log("Deleted from storage"))
        .catch((error) => console.log("Error deleting from storage!", error));
    }

    const userID = user.uid;
    const deleteFromDB = databaseRef(database, `${DB_USER_KEY}/${userID}`);
    update(deleteFromDB, { avatar: null }).then(() =>
      console.log("Deleted from database")
    );

    // Update the user object in the state
    const updatedUser = { ...user, avatar: null };
    setStates(updatedUser)
      .then(() => {
        console.log("Removed avatar from user database");
      })
      .catch((error) => console.log("Error deleting from database!", error));
  };

  const renderModal = (
    <div>
      <table
        style={{
          fontSize: "0.9rem",
          margin: "auto",
        }}
      >
        <tbody>
          <tr>
            <td style={{ width: "8rem" }}>Display Name:</td>
            <td>
              <input
                className="update-input"
                type="text"
                defaultValue={user.name}
                onChange={(e) => setEditName(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td>Age</td>
            <td>
              <input
                className="update-input"
                type="text"
                defaultValue={user.age}
                onChange={(e) => setEditAge(e.target.value)}
              />
            </td>
          </tr>

          <tr>
            <td>Gender</td>
            <td>
              <input
                className="update-input"
                type="text"
                defaultValue={user.gender}
                onChange={(e) => setEditGender(e.target.value)}
              />
            </td>
          </tr>

          <tr>
            <td>Height (in cm)</td>
            <td>
              <input
                className="update-input"
                type="text"
                defaultValue={user.height}
                onChange={(e) => setEditHeight(e.target.value)}
              />
            </td>
          </tr>

          <tr>
            <td>Weight (in kg)</td>
            <td>
              <input
                className="update-input"
                type="text"
                defaultValue={user.weight}
                onChange={(e) => setEditWeight(e.target.value)}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
        <button className="save-button font" onClick={handleSaveProfile}>
          save
        </button>
      </div>
    </div>
  );

  const isLargeScreen = useMediaQuery("(min-width: 800px)");
  const renderModalforLgScreen = (
    <div>
      <table
        style={{
          fontSize: "1rem",
          margin: "2.5rem auto 0rem auto",
        }}
      >
        <tbody>
          <tr>
            <td style={{ width: "7.5rem" }}>Display Name:</td>
            <td>
              <input
                className="update-input wider"
                style={{ width: "29rem" }}
                type="text"
                defaultValue={user.name}
                onChange={(e) => setEditName(e.target.value)}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <table
        style={{
          fontSize: "1rem",
          margin: "0.5rem auto 2.5rem auto",
        }}
      >
        <tbody>
          <tr>
            <td style={{ width: "6rem" }}>Age</td>
            <td>
              <input
                className="update-input wider"
                type="text"
                defaultValue={user.age}
                onChange={(e) => setEditAge(e.target.value)}
              />
            </td>
            <td>Gender</td>
            <td>
              <input
                className="update-input wider"
                type="text"
                defaultValue={user.gender}
                onChange={(e) => setEditGender(e.target.value)}
              />
            </td>
          </tr>

          <tr>
            <td>Height (in cm)</td>
            <td>
              <input
                className="update-input wider"
                type="text"
                defaultValue={user.height}
                onChange={(e) => setEditHeight(e.target.value)}
              />
            </td>
            <td>Weight (in kg)</td>
            <td>
              <input
                className="update-input wider"
                type="text"
                defaultValue={user.weight}
                onChange={(e) => setEditWeight(e.target.value)}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div style={{ textAlign: "center" }}>
        <button className="save-button font" onClick={handleSaveProfile}>
          save
        </button>
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
            margin: window.innerWidth > 1100 ? "1.5rem" : "auto",
          }}
        >
          <h2 className="font" style={{ marginBottom: "auto" }}>
            Hello, {user.name}!
          </h2>
          <p style={{ marginTop: "0.5rem" }}>
            Update your photo and personal details here
          </p>
        </div>
        <div className="container">
          <div className="inner-container">
            {user.avatar !== undefined ? (
              <img
                src={user.avatar}
                alt="avatar"
                style={{
                  width: user.avatar.wdith > user.avatar.height ? "" : "100%",
                  height: user.avatar.height > user.avatar.width ? "" : "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <img
                src={defaultAvatar}
                className="avatar-image"
                alt="default avatar"
                width="100%"
              />
            )}
            {/* {console.log("user.avatar:", user.avatar)} */}
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
            ref={fileInputRef}
            id="fileInput"
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
          <button className="delete-button" onClick={handleDelete}>
            delete
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="flexCenter">
        <div
          style={{
            margin: "1.5rem 0 1rem 1rem",
            fontWeight: "600",
          }}
        >
          <div id="marginB">Display Name:</div>
          <div id="marginB">Age:</div>
          <div id="marginB">Height (in cm):</div>
          <div id="marginB">Weight (in kg):</div>
          <div id="marginB">Gender:</div>
        </div>
        <div
          style={{
            margin: "1.5rem 0 1rem 1rem",
          }}
        >
          <div id="marginB">{user.name}</div>
          <div id="marginB">{user.age}</div>
          <div id="marginB">{user.height}</div>
          <div id="marginB">{user.weight}</div>
          <div id="marginB">{user.gender}</div>
        </div>
      </div>

      <div className="flexCenter">
        <button className="modalEditButton" onClick={handleOpenModal}>
          Edit Profile
        </button>
        <Modal open={openEditModal} onClose={handleCloseModal} id="modal">
          <Box className="modalBox">
            <h2 className="font displaytext">Edit Profile</h2>
            {isLargeScreen ? renderModalforLgScreen : renderModal}
          </Box>
        </Modal>
      </div>
    </div>
  );
}
