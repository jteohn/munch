import React, { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
export default function Recipe() {
  const [recipeSearchQuery, setRecipeSearchQuery] = useState("");
  const [mealTypeQuery, setMealTypeQuery] = useState("Breakfast");
  const [modalStatus, setModalStatus] = useState(false);
  const [recipeResults, setRecipeResults] = useState(null);
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState(null);

  const openModal = (index) => {
    console.log("setModalStatus set to true");
    setSelectedRecipeIndex(index);
    setModalStatus(true);
  };
  const closeModal = () => setModalStatus(false);

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
        console.log(result.data.hits);
        const savedRecipes = result.data.hits;
        setRecipeResults(savedRecipes);
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
      <div>
        {recipeResults === null
          ? "No Search Active!"
          : recipeResults.map((result, indexed) => {
              return (
                <div key={indexed}>
                  <Card sx={{ minWidth: 275 }}>
                    <CardMedia
                      sx={{ height: "150px", width: "150px" }}
                      image={result.recipe.images.THUMBNAIL.url}
                    />
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        <a
                          href={result.recipe.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Recipe {indexed + 1}
                        </a>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Calories: {result.recipe.calories.toFixed(0)}
                      </Typography>
                      <Button size="small" onClick={() => openModal(indexed)}>
                        Ingredients
                      </Button>
                      {modalStatus &&
                        recipeResults &&
                        recipeResults[selectedRecipeIndex] && (
                          <Modal open={modalStatus} onClose={closeModal} center>
                            <h2>Ingredients:</h2>
                            <ul>
                              {recipeResults[
                                selectedRecipeIndex
                              ].recipe.ingredientLines.map(
                                (ingredient, index) => (
                                  <li key={index + 1}>{ingredient}</li>
                                )
                              )}
                            </ul>
                          </Modal>
                        )}
                    </CardContent>
                  </Card>
                  {/* <Card>
                    <Card.Img
                      variant="top"
                      src={result.recipe.images.THUMBNAIL.url}
                      alt=""
                      style={{ height: "100px", width: "100px" }}
                    />
                    <Card.Title>
                      <a href={result.recipe.url}>Recipe {indexed + 1}</a>
                    </Card.Title>
                    <Card.Text>
                      <div>Calories: {result.recipe.calories.toFixed(0)}</div>
                      <button onClick={() => openModal(indexed)}>
                        Ingredient List
                      </button>
                      {modalStatus &&
                        recipeResults &&
                        recipeResults[selectedRecipeIndex] && (
                          <Modal open={modalStatus} onClose={closeModal} center>
                            <h2>Ingredients:</h2>
                            <ul>
                              {recipeResults[
                                selectedRecipeIndex
                              ].recipe.ingredientLines.map(
                                (ingredient, index) => (
                                  <li key={index + 1}>{ingredient}</li>
                                )
                              )}
                            </ul>
                          </Modal>
                        )}
                    </Card.Text>
                  </Card> */}
                </div>
              );
            })}
      </div>
    </div>
  );
}
