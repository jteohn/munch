import React, { useCallback, useEffect, useState, useContext } from "react";
import { UserContext } from "../App";

export default function CalorieRequirement() {
  const user = useContext(UserContext);

  // A: temporary hardcoded formula
  // J: pending to pass in user object + set user object (to allow editing)
  const [gender, setGender] = useState(user.gender);
  const [weight, setWeight] = useState(user.weight);
  const [height, setHeight] = useState(user.height);
  const [age, setAge] = useState(user.age);
  const [BMR, setBMR] = useState(0);

  // call useCallback so that values will only be recomputed if any of its dependencies change.
  // for more info: https://infinitypaul.medium.com/reactjs-useeffect-usecallback-simplified-91e69fb0e7a3

  const calculateCalories = useCallback(() => {
    let basalMetabolicRate = 0;
    let updateGender = gender.toLowerCase();

    if (updateGender === "male") {
      basalMetabolicRate = (
        88.362 +
        13.397 * weight +
        4.799 * height -
        5.677 * age
      ).toFixed(2);
    } else if (updateGender === "female") {
      basalMetabolicRate = (
        447.593 +
        9.247 * weight +
        3.098 * height -
        4.33 * age
      ).toFixed(2);
    }
    setBMR(basalMetabolicRate);
  }, [gender, weight, height, age]);

  useEffect(() => {
    calculateCalories();
  }, [calculateCalories]);

  // const updateUserValues = (prop, value) => {
  //   if (prop === "gender") {
  //     setGender(value);
  //   } else if (prop === "weight") {
  //     setWeight(value);
  //   } else if (prop === "height") {
  //     setHeight(value);
  //   } else if (prop === "age") {
  //     setAge(value);
  //   }
  // };

  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <h3>Calorie Calculator</h3>

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

        <div className="cal-calculatorDisplay">
          <div>
            <label>Age</label>
            <br />
            <input
              className="prefilled-inputs"
              type="text"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          <div>
            <label>Gender</label>
            <br />
            <input
              className="prefilled-inputs"
              type="text"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            />
          </div>
        </div>
        <br />
        <div className="generatedResult">
          {Math.floor(BMR)}
          <span className="smallFont"> kcal</span>
        </div>

        <p className="smallFont" style={{ padding: "1rem 1rem" }}>
          Based on the information you have provided, for a{" "}
          <span className="bold">{age}-year old</span>,{" "}
          <span className="bold">{gender.toLowerCase()}</span>, weighing{" "}
          <span className="bold">{weight}kg</span>, your daily recommended
          calorie intake is <span className="bold">{Math.floor(BMR)}kcal</span>.
        </p>
      </div>
    </div>
  );
}

// Previous code for reference:

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
//   let gender = "male";
//   let weight = 75;
//   let height = 170;
//   let age = 25;
//   let basalMetabolicRate = 0;
//   if (gender === "male") {
//     basalMetabolicRate = (
//       88.362 +
//       13.397 * weight +
//       4.799 * height -
//       5.677 * age
//     ).toFixed(2);
//   } else {
//     basalMetabolicRate = (
//       447.593 +
//       9.247 * weight +
//       3.098 * height -
//       4.33 * age
//     ).toFixed(2);
//   }

//   return (
//     <div>
//       For a {age} year old {gender} weighing at {weight}kg, you require{" "}
//       {basalMetabolicRate} calories per day to keep up with your metabolism.
//     </div>
//   );
// }
