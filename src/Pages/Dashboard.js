import React, { useContext } from "react";
import BMICalculator from "../Components/BMICalculator";
import CalorieRequirement from "../Components/CalorieRequirement";
import ApiTest1 from "../Components/ApiTest1";
import { useMediaQuery } from "@mui/material";
import { UserContext } from "../App";

// now the important moment of truth! did you pass?

export default function Dashboard() {
  const user = useContext(UserContext);

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
        <h2 style={{ marginBottom: "auto" }}>Hello, {user.name} </h2>
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

      {/* For testing purposes - to be removed once testing is completed */}
      <ApiTest1 />
    </div>
  );
}
