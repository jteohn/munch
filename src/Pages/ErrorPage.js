import React from "react";
import { useNavigate } from "react-router-dom";

// Feel free to change the words!

export default function ErrorPage() {
  const navigate = useNavigate();
  const redirect = (e) => {
    e.preventDefault();
    navigate("/");
  };
  return (
    <div>
      <h2>Oooops.</h2>
      <p>Somehow you've ended up in an invalid section.</p>
      <p>
        Click
        <button onClick={redirect}>here</button> to go back to the homepage.
      </p>
    </div>
  );
}
