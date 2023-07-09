import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { UserContext } from "../App";

export default function Recipe() {
  // import context

  const [recipeSearchQuery, setRecipeSearchQuery] = useState("");
  const [mealTypeQuery, setMealTypeQuery] = useState("Breakfast");
  const [modalStatus, setModalStatus] = useState(false);
  const [recipeResults, setRecipeResults] = useState([]);
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState(0);
  const [selectedSaveOption, setSelectedSaveOption] = useState({});
  const [searchDone, setSearchDone] = useState(false);

  // let dataToPass = selectedSaveOption;

  const testSavedOption = (e) => {
    e.preventDefault();
    console.log(selectedSaveOption);
  };
  //these 2 for context use
  const saveOption = (index) => {
    setSelectedRecipeIndex(index);
  };

  useEffect(() => {
    if (searchDone) {
      console.log(`selectedRecipeIndex: ${selectedRecipeIndex}`);
      setSelectedSaveOption({
        url: recipeResults[selectedRecipeIndex].recipe.url,
        calories: recipeResults[selectedRecipeIndex].recipe.calories.toFixed(0),
      });
    } else {
      return;
    }
  }, [recipeResults, selectedRecipeIndex]);

  useEffect(() => {
    console.log(selectedSaveOption);
  }, [selectedSaveOption]);
  // these 2 for modal open n close
  const openModal = (index) => {
    setSelectedRecipeIndex(index);
    setModalStatus(true);
  };
  const closeModal = () => setModalStatus(false);
  // handles the search function, shows recipe n stuff, does the fetch n all
  const handleSearch = (e) => {
    e.preventDefault();
    console.log(`mealTypeQuery: ${mealTypeQuery}`);
    console.log(`recipeSearchQuery: ${recipeSearchQuery}`);
    if (recipeSearchQuery === "" || recipeSearchQuery === undefined) {
      alert("You cannot search for nothingness!");
      setRecipeSearchQuery("");
      return;
    }
    axios
      .get(
        `https://api.edamam.com/api/recipes/v2?type=public&q=${recipeSearchQuery}&app_id=${process.env.REACT_APP_EDAMAM_RECIPE_ID}&app_key=${process.env.REACT_APP_EDAMAM_RECIPE_KEY}&diet=balanced&mealType=${mealTypeQuery}&dishType=Main%20course&dishType=Salad&dishType=Soup&dishType=Starter&imageSize=REGULAR&field=uri&field=image&field=images&field=source&field=url&field=ingredientLines&field=calories&field=totalWeight&field=totalTime&field=mealType&field=totalNutrients&field=totalDaily`
      )
      .then((result) => {
        setRecipeSearchQuery("");
        const savedRecipes = result.data.hits;
        console.log(result.data.hits);
        setRecipeResults(savedRecipes);
        setSearchDone(true);
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
        <button onClick={testSavedOption}>test</button>
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
                  <Card
                    sx={{
                      minWidth: 275,
                      maxWidth: 300,
                      bgcolor: "text.secondary",
                    }}
                  >
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
                    <Button size="small" onClick={() => saveOption(indexed)}>
                      Save Recipe!
                    </Button>
                  </Card>
                  <br />
                </div>
              );
            })}
      </div>
    </div>
  );
}
