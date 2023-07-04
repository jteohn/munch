import React from "react";
import BMICalculator from "../Components/BMICalculator";
import CalorieRequirement from "../Components/CalorieRequirement";
import ApiTest1 from "../Components/ApiTest1";
import { useMediaQuery } from "@mui/material";

// now the important moment of truth! did you pass?

export default function Dashboard(props) {
  // const { name } = props;

  const isLargeScreen = useMediaQuery("(min-width: 900px)");
  const split2columns = (
    <div className="dashboard-outercontainer" style={{ height: "60vh" }}>
      <div className="dashboard-innercontainer" style={{ height: "55.5vh" }}>
        <div
          style={{ display: "flex", flexDirection: "row", marginTop: "1rem" }}
        >
          <div>
            <BMICalculator />
          </div>
          <hr style={{ margin: "1.5rem 2rem", opacity: "0.3" }} />
          <div>
            <CalorieRequirement />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* TOP SECTION */}
      <div className="dashboard-margin">
        <h2 style={{ marginBottom: "auto" }}>Hello, </h2>
        <p style={{ marginTop: "auto" }}>Welcome to your dashboard!</p>
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

      {/* For testing purposes: */}
      <ApiTest1 />
    </div>
  );
}
