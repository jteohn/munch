import React, { useState } from "react";
import welcome from "../assets/welcome.svg";

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleLogin } = props;

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  return (
    <div
      className="mobileView desktopView"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
      }}
    >
      <div>
        <img src={welcome} alt="welcome" className="welcome-image" />
      </div>
      <div>
        <h2 className="header-message">Sign in</h2>
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
        <button
          className="login-signup-buttons"
          style={{
            backgroundColor: "#FDE6C1",
          }}
          onClick={handleSubmit}
        >
          Sign in
        </button>
        <p
          style={{ color: "#42403F", fontSize: "0.8rem", textAlign: "center" }}
        >
          Don't have an account?{" "}
          <a href="/signup" className="footermsg">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
