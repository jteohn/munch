import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Box,
  Card,
  Modal,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
} from "@mui/material";
import Button from "@mui/material/Button";
import Swal from "sweetalert2";

export default function Recipe(props) {
  const [recipeSearchQuery, setRecipeSearchQuery] = useState("");
  const [mealTypeQuery, setMealTypeQuery] = useState("Breakfast");
  const [modalStatus, setModalStatus] = useState(false);
  const [saveModalStatus, setSaveModalStatus] = useState(false);
  const [recipeResults, setRecipeResults] = useState([]);
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState(0);
  const [selectedSaveOption, setSelectedSaveOption] = useState({});
  const [searchDone, setSearchDone] = useState(false);
  const [saveDone, setSaveDone] = useState(false);
  const [recipeName, setRecipeName] = useState("");
  const [selectedChoiceOfMealType, setSelectedChoiceOfMealType] =
    useState("Breakfast");
  const { dataFromRecipe } = props;
  const [updateState, setUpdateState] = useState(0);
  // just a testing option to see the current selectedSaveOption STATE
  const testSavedOption = (e) => {
    e.preventDefault();
    console.log(selectedSaveOption);
  };
  //these 2 for to send data
  const openSaveOptions = (index) => {
    setSelectedRecipeIndex(index);
    openSaveModal();
  };

  useEffect(() => {
    if (searchDone && saveDone) {
      console.log(`selectedRecipeIndex: ${selectedRecipeIndex}`);
      setSelectedSaveOption({
        url: recipeResults[selectedRecipeIndex].recipe.url,
        calories: recipeResults[selectedRecipeIndex].recipe.calories.toFixed(0),
        recipeName: recipeName,
        mealType: selectedChoiceOfMealType,
      });
    } else {
      return;
    }
  }, [
    recipeResults,
    selectedRecipeIndex,
    saveDone,
    recipeName,
    searchDone,
    selectedChoiceOfMealType,
  ]);

  // these 2 for INGREDIENTS modal open n close
  const openModal = (index) => {
    setSelectedRecipeIndex(index);
    setModalStatus(true);
  };
  const closeModal = () => {
    setModalStatus(false);
  };

  // these 2 for SAVE modal open n close
  const openSaveModal = () => {
    setSaveModalStatus(true);
    setRecipeName("");
    setSaveDone(false);
  };

  const closeSaveModal = () => {
    setSaveModalStatus(false);
  };

  // function for saving RECIPE to pass to other components
  const saveTheRecipe = () => {
    setSaveDone(true);
    closeSaveModal();
    setUpdateState(updateState + 1);
    // dataFromRecipe(selectedSaveOption);
  };

  useEffect(() => {
    if (saveDone) {
      console.log(selectedSaveOption);
      dataFromRecipe(selectedSaveOption);
      console.log("SAVE DONE");
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Success!",
        text: "Recipe Exported, You can now import at MEALPLAN!",
        footer: '<a href="/mealplan">Bring me there!</a>',
      });
    }
  }, [updateState, selectedSaveOption]);

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
  // this one is used when selecting before SEARCH, to search recipes of that timing
  const changeMealType = (e) => {
    setMealTypeQuery(e.target.value);
  };

  const saveChosenMealType = (e) => {
    setSelectedChoiceOfMealType(e.target.value);
  };
  return (
    <div>
      <h1>Recipes!</h1>
      <div>
        <button onClick={testSavedOption}>test save data</button>
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
          ? "Search for something to find FOOOOOOOOOOOOD!"
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
                      sx={{ height: "300px", width: "300px" }}
                      image={result.recipe.images.REGULAR.url}
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
                      <br />
                      <Button
                        size="small"
                        onClick={() => openSaveOptions(indexed)}
                      >
                        Save Recipe!
                      </Button>
                    </CardContent>
                  </Card>
                  <br />
                </div>
              );
            })}
      </div>
      {modalStatus && recipeResults && recipeResults[selectedRecipeIndex] && (
        <Modal open={modalStatus} onClose={closeModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Ingredients:
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <ul>
                {recipeResults[selectedRecipeIndex].recipe.ingredientLines.map(
                  (ingredient, index) => (
                    <li key={index + 1}>{ingredient}</li>
                  )
                )}
              </ul>
            </Typography>
          </Box>
        </Modal>
      )}
      {/* modal for saving choices*/}
      {saveModalStatus &&
        recipeResults &&
        recipeResults[selectedRecipeIndex] && (
          <Modal open={saveModalStatus} onClose={closeSaveModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                border: "2px solid #000",
                boxShadow: 24,
                p: 4,
              }}
            >
              <Grid item xs={12} md={4} className="flexCenter">
                <TableContainer
                  component={Paper}
                  sx={{ maxWidth: 500, borderRadius: "20px" }}
                >
                  <Table
                    sx={{ maxWidth: 500 }}
                    size="small"
                    aria-label="a dense table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <label>Name your Recipe</label>
                          <br />
                          <input
                            className="meal-input"
                            type="text"
                            placeholder="e.g. RECIPE 1"
                            value={recipeName}
                            onChange={(e) => setRecipeName(e.target.value)}
                          />
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          <label>Desired Meal Timing</label>
                          <select
                            value={selectedChoiceOfMealType}
                            onChange={saveChosenMealType}
                          >
                            <option value={"Breakfast"}>Breakfast</option>
                            <option value={"Lunch"}>Lunch</option>
                            <option value={"Dinner"}>Dinner</option>
                          </select>
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ textAlign: "center" }}>
                        <TableCell>
                          <div>Selected: Recipe {selectedRecipeIndex + 1}</div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <img
                            src={
                              recipeResults[selectedRecipeIndex].recipe.images
                                .SMALL.url
                            }
                            alt="imagehere"
                          />
                        </TableCell>
                      </TableRow>
                    </TableHead>
                  </Table>
                  <button className="button desktop" onClick={saveTheRecipe}>
                    Save
                  </button>
                  <button className="button mobile" onClick={saveTheRecipe}>
                    Save
                  </button>
                </TableContainer>
              </Grid>
            </Box>
          </Modal>
        )}
    </div>
  );
}
