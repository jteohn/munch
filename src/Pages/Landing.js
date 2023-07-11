import React from "react";
import { useNavigate } from "react-router-dom";
import munchbg from "../assets/munchbg.png";

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        backgroundImage: `url(${munchbg})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        height: "42rem",
      }}
    >
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
            style={{ backgroundColor: "#FED0A3", color: "#42403F" }}
            onClick={() => navigate("/login")}
          >
            Log in
          </button>
          <button
            className="landing-buttons"
            style={{ backgroundColor: "#E1E7AA", color: "#42403F" }}
            onClick={() => navigate("/signup")}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
