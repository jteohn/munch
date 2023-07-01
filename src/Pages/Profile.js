import React from "react";
import BMICalculator from "../Components/BMICalculator";
import CalorieRequirement from "../Components/CalorieRequirement";

// all the private info. Lock it with a lock!

export default function Profile() {
  return (
    <div>
      <h1>Profile Page!</h1>
      <BMICalculator />
      <CalorieRequirement />
    </div>
  );
}
