import React, { useState } from "react";
import welcome from "../assets/welcome.svg";
import welcomebg from "../assets/welcomebg.jpg";

import { useMediaQuery } from "@mui/material";

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleLogin } = props;

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  const isLargeScreen = useMediaQuery("(min-width: 960px)");
  const addLeftSideBar = (
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
      <div style={{ marginRight: "50px" }}>
        <img
          src={welcomebg}
          alt="welcome-sidebar"
          height="500rem"
          style={{ borderRadius: "20px", opacity: "0.8" }}
        />
      </div>
      {/* RIGHT SIDE COLUMN */}
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
            style={{
              marginTop: "-5rem",
            }}
          >
            Sign in
          </h2>
        </div>
        {/* Email & PW inputs */}
        <div>
          <div
            style={{
              margin: "auto auto",
            }}
          >
            <label className="labels">Email</label>
            <br />
            <input
              className="login-signup-inputs"
              type="text"
              name="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <br />
            <label className="labels">Password</label>
            <br></br>
            <input
              className="login-signup-inputs"
              type="password"
              name="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
          </div>
          <div>
            <button
              className="login-signup-buttons"
              style={{
                backgroundColor: "#FDE6C1",
                marginTop: "1.5rem",
              }}
              onClick={handleSubmit}
            >
              Sign in
            </button>
            <p
              style={{
                color: "#42403F",
                fontSize: "0.8rem",
                textAlign: "center",
              }}
            >
              Don't have an account?{" "}
              <a href="/signup" className="login-signup-footermsg">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isLargeScreen ? (
        addLeftSideBar
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
          <img src={welcome} alt="welcome" height="180rem" />
          <div style={{ textAlign: "center" }}>
            <h2 className="header-message">Sign in</h2>
          </div>

          <div
            style={{
              margin: "auto auto",
            }}
          >
            <label className="labels">Email</label>
            <br />
            <input
              className="login-signup-inputs"
              type="text"
              name="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <br />
            <label className="labels">Password</label>
            <br></br>
            <input
              className="login-signup-inputs"
              type="password"
              name="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <br />
            <button
              className="login-signup-buttons"
              style={{
                backgroundColor: "#FDE6C1",
              }}
              onClick={handleSubmit}
            >
              Sign in
            </button>
            <p style={{ color: "#42403F", fontSize: "0.8rem" }}>
              Don't have an account?{" "}
              <a href="/signup" className="login-signup-footermsg">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
