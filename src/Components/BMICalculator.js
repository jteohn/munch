import React, { useContext } from "react";
import { UserContext } from "../App";

export default function BMICalculator() {
  const user = useContext(UserContext);
  //BMI Calculator uses the formula of a person’s weight in kilograms divided by the square of the person’s height in metres (kg/m2).

  // Function to convert centimetres to metres if signup was done in centimetres
  const convertCentimetresToMetres = (centimetres) => centimetres / 100;

  //Calculation of BMI (using props)
  // const bmi = props.weight / convertCentimetresToMetres(props.height) ** 2;

  //Calculation of BMI (hardcoded temporarily)
  const bmi = (
    user.weight /
    convertCentimetresToMetres(user.height) ** 2
  ).toFixed(2);

  //Measuring Nutritional Status off the calculated BMI
  const nutritionalStatus = () => {
    switch (true) {
      case bmi < 18.5:
        return "Underweight";
      case bmi >= 18.5 && bmi <= 24.9:
        return "Normal weight";
      case bmi >= 25.0 && bmi <= 29.9:
        return "Pre-obesity";
      case bmi >= 30.0 && bmi <= 34.9:
        return "Obesity class I";
      case bmi >= 35.0 && bmi <= 39.9:
        return "Obesity class II";
      default:
        return "Obesity class III";
    }
  };

  return (
    <div>
      <div>Your calculated BMI is {bmi}.</div>
      <div>
        Based off your BMI, your nutritional status falls under the category of{" "}
        {nutritionalStatus(bmi)}
      </div>
      {bmi >= 18.5 && bmi <= 24.9 ? null : (
        <div>Your BMI is currently out of the Healthy range.</div>
      )}
      <div>
        All Body Mass Index (BMI) data is derived from World Health
        Organisation.
      </div>
    </div>
  );
}
