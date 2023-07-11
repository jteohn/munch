import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div
        className="bounce"
        style={{
          marginTop: "10rem",
          fontFamily: "Inria Serif, Times New Roman",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "2rem", color: "#42403F" }}>Welcome to</h2>
        <h1
          style={{
            fontSize: "4.5rem",
            color: "#42403F",
            margin: "-40px 0 20px 0",
          }}
        >
          munch
        </h1>
      </div>
      <div>
        <button
          className="landing-buttons"
          style={{ backgroundColor: "#FDE6C1" }}
          onClick={() => navigate("/login")}
        >
          Log in
        </button>
        <button
          className="landing-buttons"
          style={{ backgroundColor: "#C6EAD9" }}
          onClick={() => navigate("/signup")}
        >
          Sign up
        </button>
      </div>
    </div>
  );
}
