import React, { useContext } from "react";
import { UserContext } from "../App";

export default function CalorieRequirement() {
  const user = useContext(UserContext);
  //Men: BMR = 88.362 + (13.397 x weight in kg) + (4.799 x height in cm) – (5.677 x age in years)
  //Women: BMR = 447.593 + (9.247 x weight in kg) + (3.098 x height in cm) – (4.330 x age in years)

  // working formulae
  // const gender = props.gender;
  // let basalMetabolicRate = 0;
  // const age = props.age
  // const weight = props.weight
  // const height = props.height
  // if (gender === "male") {
  //   basalMetabolicRate =
  //     (88.362 + 13.397 * weight + 4.799 * height - 5.677 * age).toFixed(2);
  // } else {
  //   basalMetabolicRate =
  //     (447.593 + 9.247 * weight + 3.098 * height - 4.33 * age).toFixed(2);
  // }

  // temporary hardcoded formula
  let gender = user.gender;
  let weight = user.weight;
  let height = user.height;
  let age = user.age;
  let basalMetabolicRate = 0;
  if (gender === "male") {
    basalMetabolicRate = (
      88.362 +
      13.397 * weight +
      4.799 * height -
      5.677 * age
    ).toFixed(2);
  } else {
    basalMetabolicRate = (
      447.593 +
      9.247 * weight +
      3.098 * height -
      4.33 * age
    ).toFixed(2);
  }

  return (
    <div>
      For a {age} year old {gender} weighing at {weight}kg, you require{" "}
      {basalMetabolicRate} calories per day to keep up with your metabolism.
    </div>
  );
}
