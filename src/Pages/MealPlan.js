import React, { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "../Components/Calendar";

// now... do you have the discipline to follow through?

export default function MealPlan() {
  const [ingredientSearchQuery, setIngredientSearchQuery] = useState("");
  const [totalResults, setTotalResults] = useState([]);
  const [displayData, setDisplayData] = useState(null);

  const [foodName, setFoodName] = useState("");
  const [addMeal, setAddMeal] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    axios({
      method: "get",
      headers: { "X-Api-Key": process.env.REACT_APP_CALORIENINJA_KEY },
      url: `https://api.calorieninjas.com/v1/nutrition?query=${ingredientSearchQuery}`,
      contentType: "application/json",
    })
      .then((result) => {
        // Added a condition to check if the ingredient exists in our API.
        if (result.data.items.length === 0) {
          console.log(
            "`oops, you caught us! We are still working to include all the ingredients!`"
          );
        } else {
          setTotalResults((prevResults) => [...prevResults, result.data]);
        }
        setIngredientSearchQuery("");
      })
      .catch((error) => {
        console.log(`error: ${error}`);
      });
  };

  const handleAddCalories = () => {
    const addCalories = displayData.reduce(
      (sum, result) => sum + result.calories,
      0
    );

    const newMealPlan = {
      nameOfFood: foodName,
      totalCalories: addCalories.toFixed(2),
    };

    setAddMeal([...addMeal, newMealPlan]);

    console.log(`add calories:`, addCalories);
    console.log(`new meal plan:`, newMealPlan);
  };

  // open modal to allow user to input the name
  // const handleInputChange = (e) => {
  //   setFoodName(e.target.value);
  // };

  const handleReset = (e) => {
    setTotalResults([]);
  };

  // Displays results from totalResults array & update the displayData state with the transformed data.
  useEffect(() => {
    // data stores the object (aka transformed data) from totalResults
    const data = totalResults.map((result) => {
      return {
        servingSize: result.items[0].serving_size_g,
        name: result.items[0].name,
        calories: result.items[0].calories,
      };
    });
    // data is then passed to displayData & update state
    setDisplayData(data);
  }, [totalResults]);
  // dependency array - useEfect is called whenever totalResults changes.

  return (
    <div>
      <h1>Meal Plan</h1>
      <div>
        <div>Start planning your meal by searching up the ingredients!</div>
        <input
          type="text"
          placeholder="search"
          value={ingredientSearchQuery}
          onChange={(e) => setIngredientSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Add Item</button>
      </div>
      {displayData && displayData.length > 0
        ? displayData.map((data, index) => (
            <div key={index + 1}>
              <ul>
                <li>
                  {data.servingSize}g of {data.name}: {data.calories}kcal
                </li>
              </ul>
            </div>
          ))
        : null}

      <br />
      <input
        type="text"
        value={foodName}
        placeholder="Let's give it a name!"
        onChange={(e) => setFoodName(e.target.value)}
      />
      <button onClick={handleAddCalories}>Add Meal</button>
      <button onClick={handleReset}>Reset Foods</button>
      <br />
      <br />
      <Calendar />
    </div>
  );
}

// if ingredient cannot be found (aka return undefined) alert user to key in another ingredient or similar ingredient

// {displayData
//   ? displayData.map((data, index) => (
//       <div key={index + 1}>
//         <ul>
//           <li>
//             {data.servingSize}g of {data.name}: {data.calories}kcal
//           </li>
//         </ul>
//       </div>
//     ))
//   : null}
