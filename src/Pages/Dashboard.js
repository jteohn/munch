import React, { useContext } from "react";
import BMICalculator from "../Components/BMICalculator";
import CalorieRequirement from "../Components/CalorieRequirement";
import ApiTest1 from "../Components/ApiTest1";
import ApiTest2 from "../Components/ApiTest2";
import { UserContext } from "../App";
import { useMediaQuery } from "@mui/material";

// now the important moment of truth! did you pass?

export default function Dashboard() {
  const currUser = useContext(UserContext);

  const isLargeScreen = useMediaQuery("(min-width: 910px)");
  const split2columns = (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        className="dashboard-outercontainer"
        style={{
          height: "25rem",
          margin: "0 2rem",
          maxWidth: isLargeScreen ? "1300px" : "100%",
        }}
      >
        <div className="dashboard-innercontainer" style={{ height: "23rem" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: "0.1rem",
            }}
          >
            <div>
              <BMICalculator />
            </div>
            <hr
              style={{ margin: "1.5rem 2rem", height: "20rem", opacity: "0.3" }}
            />
            <div>
              <CalorieRequirement />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* TOP SECTION */}
      <div
        className="dashboard-margin"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ marginBottom: "auto" }}>Hello {currUser.name}, </h2>
        <p style={{ margin: "auto" }}>Welcome to your dashboard!</p>
      </div>
      <br />

      {/* MAIN BODY */}
      {isLargeScreen ? (
        split2columns
      ) : (
        <>
          <div className="dashboard-outercontainer">
            <div className="dashboard-innercontainer">
              {/* DISPLAY BMI */}
              <div>
                <BMICalculator />
              </div>
              <hr style={{ margin: "1.5rem 2.5rem", opacity: "0.3" }} />
              {/* DISPLAY CALORIES */}
              <div>
                <CalorieRequirement />
              </div>
            </div>
          </div>
        </>
      )}

      <p className="smallFont dashboard-margin" style={{ textAlign: "center" }}>
        <em>
          Should you wish to make changes to your details, you can do so on the{" "}
          <span>
            <a href="/profile" className="footermsg">
              'Profile'
            </a>
          </span>{" "}
          page.
        </em>
      </p>
      <br />

      {/* For testing purposes: */}
      <ApiTest1 />
      <ApiTest2 />
    </div>
  );
}
