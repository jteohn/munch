import React, { useState } from "react";

export default function BMICalculator(props) {
  //BMI Calculator uses the formula of a person’s weight in kilograms divided by the square of the person’s height in metres (kg/m2).

  // Function to convert centimetres to metres if signup was done in centimetres
  const convertCentimetresToMetres = (centimetres) => centimetres / 100;

  //Calculation of BMI (hardcoded temporarily)
  const [weight, setWeight] = useState(90);
  const [height, setHeight] = useState(185);

  // const bmi = props.weight / convertCentimetresToMetres(props.height) ** 2;
  const bmi = (weight / convertCentimetresToMetres(height) ** 2).toFixed(2);
  //26.3

  //Measuring Nutritional Status off the calculated BMI
  const nutritionalStatus = () => {
    switch (true) {
      case bmi < 18.5:
        return "underweight";
      case bmi >= 18.5 && bmi <= 24.9:
        return "normal weight";
      case bmi >= 25.0 && bmi <= 29.9:
        return "pre-obesity";
      case bmi >= 30.0 && bmi <= 34.9:
        return "obesity class I";
      case bmi >= 35.0 && bmi <= 39.9:
        return "obesity class II";
      default:
        return "obesity class III";
    }
  };

  const renderDifferentColors = () => {
    if (
      nutritionalStatus() === "underweight" ||
      nutritionalStatus() === "pre-obesity"
    ) {
      return "yellow";
    } else if (nutritionalStatus === "normal weight") {
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
        <p
          className="smallFont"
          style={{ marginBottom: 20, padding: "0 1rem" }}
        >
          Use this tool to calculate your Body Mass Index (BMI) now to
          understand your risk level for obesity-related diseases.
        </p>
        <div className="cal-calculatorDisplay">
          <div style={{ marginBottom: 10 }}>
            <label>Height (in cm)</label>
            <br />
            <input
              className="prefilled-inputs"
              type="text"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
          <div>
            <label>Weight (in kg)</label>
            <br />
            <input
              className="prefilled-inputs"
              type="text"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <h4>Your calculated BMI is: {bmi}</h4>

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
            {nutritionalStatus(bmi)}
          </span>
        </p>
        {bmi >= 18.5 && bmi <= 24.9 ? null : (
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
