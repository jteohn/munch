import React, { useState, useEffect } from "react";
import signup from "../assets/signup.png";
import signupbg from "../assets/signupbg.jpg";
import Tooltip from "@mui/material/Tooltip";
import { useMediaQuery } from "@mui/material";
import "../App.css";

export default function Signup(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState(null);
  const [age, setAge] = useState("");
  const { handleSignup } = props;
  const { setStates } = props;
  const [isStateSetDone, setIsStateSetDone] = useState(false); // to track if state in parent is tracked
  const [secondPassword, setSecondPassword] = useState("");

  // const [hover, setHover] = useState(false);

  const handleSubmit = async () => {
    if (password !== secondPassword) {
      alert("The passwords are not identical!");
      return;
    }
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    const isLengthValid = password.length >= 8;
    if (
      hasUppercase &&
      hasLowercase &&
      hasNumber &&
      hasSpecialChar &&
      isLengthValid
    ) {
      const userObj = {
        name: name,
        email: email,
        password: password,
        height: height,
        weight: weight,
        gender: gender,
        age: age,
      };
      console.log(userObj);
      //implement these next two lines of code to ensure state is set before calling signup function
      await setStates(userObj);
      setIsStateSetDone(true);
    } else {
      alert("Your Password does not meet requirements!");
      return;
    }
  };

  // implemented to ensure all states are set in parent before calling handle Signup in parent
  useEffect(() => {
    if (isStateSetDone) {
      handleSignup();
    }
  }, [isStateSetDone, handleSignup]);

  const passwordRequirements = (
    <div>
      Password Requirements: At least
      <ol>
        <li>1 Uppercase Letter.</li>
        <li>1 Lowercase Letter.</li>
        <li>1 Number.</li>
        <li>1 Special Character (!@#*!).</li>
        <li>At least 8 Characters Long.</li>
      </ol>
    </div>
  );

  const isLargeScreen = useMediaQuery("(min-width: 960px)");
  const addRightSideBar = (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        marginTop: "4rem",
      }}
    >
      {/* LEFT SIDE COLUMN */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "20%",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2
            className="header-message"
            style={{ marginBottom: "auto", fontSize: "1.6rem" }}
          >
            Create Account
          </h2>
          <p style={{ marginTop: "auto" }}>to get started now!</p>
        </div>
        {/* Email & PW inputs */}
        <div
          style={{
            margin: "auto auto",
          }}
        >
          <label className="labels">Name</label>
          <input
            className="login-signup-inputs"
            type="text"
            name="name"
            value={name}
            required
            placeholder="John Doe"
            onChange={(e) => setName(e.target.value)}
          />
          <br />
          <label className="labels">Email</label>
          <input
            className="login-signup-inputs"
            type="text"
            name="email"
            value={email}
            required
            placeholder="example@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <label className="labels">Password</label>
          <Tooltip title={passwordRequirements}>
            <input
              className="login-signup-inputs"
              type="password"
              name="password"
              value={password}
              required
              placeholder="********"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Tooltip>
          <br />
          <label className="labels">Verify Password</label>
          <input
            className="login-signup-inputs"
            type="password"
            name="secondpassword"
            value={secondPassword}
            required
            placeholder="Repeat your Password"
            onChange={(e) => setSecondPassword(e.target.value)}
          />
          <br />
          <label className="labels">Height (in cm)</label>
          <input
            className="login-signup-inputs"
            type="text"
            name="height"
            value={height}
            required
            placeholder="150"
            onChange={(e) => setHeight(e.target.value)}
          />
          <br />
          <label className="labels">Weight (in kg)</label>
          <input
            className="login-signup-inputs"
            type="text"
            name="weight"
            value={weight}
            required
            placeholder="50"
            onChange={(e) => setWeight(e.target.value)}
          />
          <br />
          <label className="labels">Age</label>
          <input
            className="login-signup-inputs"
            type="text"
            name="age"
            value={age}
            required
            placeholder="20"
            onChange={(e) => setAge(e.target.value)}
          />
          <br />
          <div style={{ textAlign: "center" }}>
            <label className="labels">Gender</label>
            <input
              type="radio"
              name="gender"
              id="female"
              value="female"
              onChange={(e) => setGender(e.target.value)}
            />
            <label className="labels">Female</label>
            <input
              type="radio"
              name="gender"
              id="male"
              value="male"
              onChange={(e) => setGender(e.target.value)}
              required
            />
            <label className="labels">Male</label>
            <br />
            <br />
          </div>
          <div>
            <button
              className="login-signup-buttons"
              style={{
                backgroundColor: "#C6EAD9",
              }}
              onClick={handleSubmit}
            >
              Sign up
            </button>
            <p
              style={{
                color: "#42403F",
                fontSize: "0.8rem",
                textAlign: "center",
              }}
            >
              Already a user?{" "}
              <a href="/login" className="footermsg">
                Sign in
              </a>
            </p>
            {/* {password !== secondPassword &&
            password !== "" &&
            secondPassword !== "" ? (
              <div>
                <span style={{ color: "red", fontSize: "0.7rem" }}>
                  The Passwords are not the same!
                </span>
              </div>
            ) : null} */}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE COLUMMN */}
      <div style={{ marginLeft: 50 }}>
        <img
          src={signupbg}
          alt="welcome-sidebar"
          height="500rem"
          style={{
            borderRadius: "20px",
            opacity: "0.75",
          }}
        />
      </div>
    </div>
  );

  return (
    <>
      {isLargeScreen ? (
        addRightSideBar
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            marginTop: "3rem",
          }}
        >
          <img src={signup} alt="signup" height="140px" />

          <h2 className="header-message" style={{ marginBottom: "auto" }}>
            Create Account
          </h2>
          <p style={{ marginTop: "auto" }}>to get started now!</p>

          <div
            style={{
              margin: "auto auto",
            }}
          >
            <label className="labels">Name</label>
            <input
              className="login-signup-inputs"
              type="text"
              name="name"
              value={name}
              required
              placeholder="John Doe"
              onChange={(e) => setName(e.target.value)}
            />
            <br />
            <label className="labels">Email</label>
            <input
              className="login-signup-inputs"
              type="text"
              name="email"
              value={email}
              required
              placeholder="example@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <label className="labels">Password</label>
            <input
              className="login-signup-inputs"
              type="password"
              name="password"
              value={password}
              required
              placeholder="********"
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <label className="labels">Verify Password</label>
            <input
              className="login-signup-inputs"
              type="password"
              name="secondpassword"
              value={secondPassword}
              required
              placeholder="Confirm Password"
              onChange={(e) => setSecondPassword(e.target.value)}
            />
            <br />
            <label className="labels">Height (in cm)</label>
            <input
              className="login-signup-inputs"
              type="text"
              name="height"
              value={height}
              required
              placeholder="150"
              onChange={(e) => setHeight(e.target.value)}
            />
            <br />
            <label className="labels">Weight (in kg)</label>
            <input
              className="login-signup-inputs"
              type="text"
              name="weight"
              value={weight}
              required
              placeholder="50"
              onChange={(e) => setWeight(e.target.value)}
            />
            <br />
            <label className="labels">Age</label>
            <input
              className="login-signup-inputs"
              type="text"
              name="age"
              value={age}
              required
              placeholder="20"
              onChange={(e) => setAge(e.target.value)}
            />
            <br />
            <div style={{ textAlign: "center" }}>
              <label className="labels">Gender</label>
              <input
                type="radio"
                name="gender"
                id="female"
                value="female"
                onChange={(e) => setGender(e.target.value)}
              />
              <label className="labels">Female</label>
              <input
                type="radio"
                name="gender"
                id="male"
                value="male"
                onChange={(e) => setGender(e.target.value)}
                required
              />
              <label className="labels">Male</label>
              <br />
              <br />
              <button
                className="login-signup-buttons"
                style={{
                  backgroundColor: "#C6EAD9",
                }}
                onClick={handleSubmit}
              >
                Sign up
              </button>
            </div>
          </div>
          <p style={{ color: "#42403F", fontSize: "0.8rem" }}>
            Already a user?{" "}
            <a href="/login" className="footermsg">
              Sign in
            </a>
          </p>
          {/* {password !== secondPassword &&
          password !== "" &&
          secondPassword !== "" ? (
            <div>
              <span style={{ color: "red", fontSize: "0.7rem" }}>
                The Passwords are not the same!
              </span>
            </div>
          ) : null} */}
        </div>
      )}
    </>
  );
}
