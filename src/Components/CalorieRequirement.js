import React, { useCallback, useEffect, useState, useContext } from "react";
import { UserContext } from "../App";

export default function CalorieRequirement() {
  const user = useContext(UserContext);
  const [weight, setWeight] = useState(user.weight);
  const [height, setHeight] = useState(user.height);
  const [age, setAge] = useState(user.age);
  const [gender, setGender] = useState(user.gender);
  const [BMR, setBMR] = useState(0);

  // Formula to compute calories
  const calculateCalories = (gender, weight, height, age) => {
    let basalMetabolicRate = 0;

    if (gender === "male") {
      basalMetabolicRate = (
        88.362 +
        13.397 * weight +
        4.799 * height -
        5.677 * age
      ).toFixed(2);
    } else if (gender === "female") {
      basalMetabolicRate = (
        447.593 +
        9.247 * weight +
        3.098 * height -
        4.33 * age
      ).toFixed(2);
    }
    return basalMetabolicRate;
  };

  // Calculate based on user info provided during sign up.
  useEffect(() => {
    setWeight(user.weight);
    setHeight(user.height);
    setAge(user.age);
    setGender(user.gender);
  }, [user]);

  // useCallback will call for calculateCalories when any of its dependencies change.
  const updateCalories = useCallback(() => {
    const basalMetabolicRate = calculateCalories(gender, weight, height, age);
    setBMR(basalMetabolicRate);
  }, [gender, weight, height, age]);

  // Trigger calculation to be updated based on the new inputs.
  useEffect(() => {
    updateCalories();
  }, [updateCalories]);

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

        <div className="cal-calculatorDisplay">
          <div>
            <label>Age</label>
            <br />
            <input
              className="prefilled-inputs"
              type="text"
              defaultValue={user.age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          <div>
            <label>Gender</label>
            <br />
            <input
              className="prefilled-inputs"
              type="text"
              defaultValue={user.gender}
              onChange={(e) => setGender(e.target.value.toLowerCase())}
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
          <span className="bold">{age}y/o</span>,{" "}
          <span className="bold">{gender}</span>, weighing{" "}
          <span className="bold">{weight}kg</span>, your daily recommended
          calorie intake is <span className="bold">{Math.floor(BMR)}kcal</span>.
        </p>
      </div>
    </div>
  );
}
