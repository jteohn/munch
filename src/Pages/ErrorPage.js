import React from "react";
import { useNavigate } from "react-router-dom";

import Card from "@mui/material/Card";

// Feel free to change the words!

export default function ErrorPage() {
  const navigate = useNavigate();
  const redirect = (e) => {
    e.preventDefault();
    navigate("/mealplan");
  };
  return (
    <div className="flexCenter" style={{ marginTop: "10%" }}>
      <Card
        style={{
          width: "60%",
          padding: "15px",
          borderRadius: "20px",
          color: "#42403F",
          backgroundColor: "#FED0A3",
        }}
      >
        <h2>Oops!</h2>
        <p>Somehow you've ended up in an invalid section.</p>
        <p>
          Click{" "}
          <button
            style={{
              border: "none",
              backgroundColor: "#000",
              color: "#FFF",
              padding: "0.3rem",
              width: "3rem",
              borderRadius: "30px",
              cursor: "pointer",
            }}
            onClick={redirect}
          >
            <strong>
              <em>here</em>
            </strong>
          </button>{" "}
          to go back to the homepage.
        </p>
      </Card>
    </div>
  );
}
