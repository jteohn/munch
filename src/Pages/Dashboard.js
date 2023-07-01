import React from "react";
import BMICalculator from "../Components/BMICalculator";
import CalorieRequirement from "../Components/CalorieRequirement";
import ApiTest1 from "../Components/ApiTest1";

// now the important moment of truth! did you pass?

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard Page!</h1>
      <BMICalculator />
      <CalorieRequirement />
      <ApiTest1 />
    </div>
  );
}
