import React, { useEffect, useState } from "react";
import Calendar from "../Components/Calendar";
import axios from "axios";

// now... do you have the discipline to follow through?

export default function MealPlan() {
  const [ingredientSearchQuery, setIngredientSearchQuery] = useState("");
  const [totalResults, setTotalResults] = useState([]);
  const [displayData, setDisplayData] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    axios({
      method: "get",
      headers: { "X-Api-Key": process.env.REACT_APP_CALORIENINJA_KEY },
      url: `https://api.calorieninjas.com/v1/nutrition?query=${ingredientSearchQuery}`,
      contentType: "application/json",
    })
      .then((result) => {
        setTotalResults((prevResults) => [...prevResults, result.data]);
        setIngredientSearchQuery("");
      })
      .catch((error) => {
        console.log(`error: ${error}`);
      });
  };
  const handleReset = (e) => {
    setTotalResults([]);
  };

  useEffect(() => {
    const data = totalResults.map((result) => {
      return {
        servingSize: result.items[0].serving_size_g,
        name: result.items[0].name,
        calories: result.items[0].calories,
      };
    });
    setDisplayData(data);
  }, [totalResults]);
  return (
    <div>
      <h1>Meal Plan</h1>
      <div>
        <div>Start Planning your meal by searching up ingredients below!</div>
        <input
          type="text"
          placeholder="search"
          value={ingredientSearchQuery}
          onChange={(e) => setIngredientSearchQuery(e.target.value)}
        />
        <input type="submit" value="submit" onClick={handleSearch} />
      </div>
      {displayData
        ? displayData.map((data, index) => (
            <div key={index + 1}>
              <div>
                {data.servingSize}g of {data.name}: {data.calories}kcal
              </div>
            </div>
          ))
        : null}
      <button onClick={handleReset}>Reset Foods</button>
      <br />
      <Calendar />
    </div>
  );
}
