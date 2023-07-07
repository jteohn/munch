import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../App";

// For Info: BMI Calculator uses the formula of a person’s weight in kilograms divided by the square of the person’s height in metres (kg/m2).

export default function BMICalculator() {
  const user = useContext(UserContext);
  const [weight, setWeight] = useState(user.weight);
  const [height, setHeight] = useState(user.height);
  const [BMI, setBMI] = useState(0);

  // Function to convert cm to metres if signup was done in centimetres
  const convertCentimetresToMetres = (centimetres) => centimetres / 100;

  // Calculate BMI based on user info provided during sign up.
  useEffect(() => {
    // Formula to compute BMI
    const calculatedBMI = (
      weight /
      convertCentimetresToMetres(height) ** 2
    ).toFixed(2);
    setBMI(calculatedBMI);
  }, [weight, height]);

  // Trigger BMI calculation to be updated based on the new inputs.
  useEffect(() => {
    setWeight(user.weight);
    setHeight(user.height);
  }, [user]);

  // Measuring Nutritional Status off the calculated BMI
  const nutritionalStatus = () => {
    switch (true) {
      case BMI < 18.5:
        return "underweight";
      case BMI >= 18.5 && BMI <= 24.9:
        return "normal weight";
      case BMI >= 25.0 && BMI <= 29.9:
        return "pre-obesity";
      case BMI >= 30.0 && BMI <= 34.9:
        return "obesity class I";
      case BMI >= 35.0 && BMI <= 39.9:
        return "obesity class II";
      default:
        return "obesity class III";
    }
  };

  // Rendering different font colours
  const renderDifferentColors = () => {
    if (
      nutritionalStatus() === "underweight" ||
      nutritionalStatus() === "pre-obesity"
    ) {
      return "yellow";
    } else if (nutritionalStatus() === "normal weight") {
      return "green";
    } else if (
      nutritionalStatus() === "obesity class I" ||
      nutritionalStatus() === "obesity class II" ||
      nutritionalStatus() === "obesity class III"
    ) {
      return "red";
    }
  };

  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <h3>BMI Calculator</h3>
        <div className="cal-calculatorDisplay">
          <div style={{ marginBottom: 10 }}>
            <label>Height (in cm)</label>
            <br />
            <input
              className="prefilled-inputs"
              type="text"
              defaultValue={user.height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
          <div>
            <label>Weight (in kg)</label>
            <br />
            <input
              className="prefilled-inputs"
              type="text"
              defaultValue={user.weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <h4>Your calculated BMI is: {BMI}</h4>

        <p className="smallFont">
          Based on your BMI, your nutritional status falls under the category of
          <br />
          <span
            className={`${renderDifferentColors()}`}
            style={{
              padding: "0 5px",
              fontWeight: 600,
              fontSize: "1rem",
            }}
          >
            {nutritionalStatus(BMI)}
          </span>
        </p>
        {BMI >= 18.5 && BMI <= 24.9 ? null : (
          <p className="smallFont" style={{ fontWeight: 600 }}>
            Your BMI is currently out of the Healthy range.
          </p>
        )}
        <p className="smallFont">
          All Body Mass Index (BMI) data is derived from World Health
          Organisation.
        </p>
      </div>
    </div>
  );
}
