import React, { useState } from "react";
import axios from "axios";
// import { database } from "../firebase";
export default function Recipe() {
  const [recipeSearchQuery, setRecipeSearchQuery] = useState("");
  const [mealTypeQuery, setMealTypeQuery] = useState("Breakfast");
  const [displayData, setDisplayData] = useState(null);

  // const DB_RECIPE_KEY = "recipeInfo/";

  const handleSearch = (e) => {
    e.preventDefault();
    console.log(`mealTypeQuery: ${mealTypeQuery}`);
    console.log(`recipeSearchQuery: ${recipeSearchQuery}`);
    axios
      .get(
        `https://api.edamam.com/api/recipes/v2?type=public&q=${recipeSearchQuery}&app_id=${process.env.REACT_APP_EDAMAM_RECIPE_ID}&app_key=${process.env.REACT_APP_EDAMAM_RECIPE_KEY}&diet=balanced&mealType=${mealTypeQuery}&dishType=Main%20course&dishType=Salad&dishType=Soup&dishType=Starter&imageSize=REGULAR&field=uri&field=image&field=images&field=source&field=url&field=ingredientLines&field=calories&field=totalWeight&field=totalTime&field=mealType&field=totalNutrients&field=totalDaily`
      )
      .then((result) => {
        setRecipeSearchQuery("");
        const savedRecipes = result.data.hits;
        console.log(savedRecipes);
        setDisplayData(
          savedRecipes.map((result, indexed) => {
            return (
              <div key={indexed}>
                <div>Recipe {indexed + 1}</div>
                <div>
                  Source: {result.recipe.source}. <br />
                  URL:
                  <a href={result.recipe.url} target="_blank" rel="noreferrer">
                    {result.recipe.url}
                  </a>
                </div>
                <img src={result.recipe.images.REGULAR.url} alt="" />
                <div>Calories: {result.recipe.calories.toFixed(0)} kcal</div>
                <div>Ingredients:</div>
                <ul>
                  {result.recipe.ingredientLines.map((ingredient, index) => (
                    <li key={index + 1}>{ingredient}</li>
                  ))}
                </ul>
                {result.recipe.totalTime !== 0 ? (
                  <div>Preparation Time: {result.recipe.totalTime} mins</div>
                ) : (
                  <div>Preparation time is not Specified.</div>
                )}
                <br />
              </div>
            );
          })
        );
      })
      .catch((error) => {
        console.log(`error: ${error}`);
      });
  };
  const changeMealType = (e) => {
    setMealTypeQuery(e.target.value);
  };

  return (
    <div>
      <h1>Recipes!</h1>

      <div>
        <form>
          <label>Select Meal Time</label>
        </form>
        <select value={mealTypeQuery} onChange={changeMealType}>
          <option value={"Breakfast"}>Breakfast</option>
          <option value={"Lunch"}>Lunch</option>
          <option value={"Dinner"}>Dinner</option>
        </select>
      </div>
      <br />
      <div>
        <input
          type="text"
          placeholder="search"
          value={recipeSearchQuery}
          onChange={(e) => setRecipeSearchQuery(e.target.value)}
        />
        <input type="submit" value="submit" onClick={handleSearch} />
      </div>
      <div>{displayData === null ? "No Search Active!" : displayData}</div>
    </div>
  );
}
