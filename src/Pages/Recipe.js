import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Modal,
  CardMedia,
  CardContent,
  Grid,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Tooltip,
  IconButton,
  TableFooter,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
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
  // const testSavedOption = (e) => {
  //   e.preventDefault();
  //   console.log(selectedSaveOption);
  // };
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
    <div style={{ margin: "1.5rem", height: "90vh" }}>
      <h1 className="flexCenter font">Search Recipes</h1>
      <div>
        <Card id="recipe-container">
          <Grid container spacing={2}>
            <Grid item xs={12} md={12} className="flexCenter">
              <label className="labels">
                <strong>Select Meal Time</strong>
              </label>
              <input
                type="radio"
                name="mealType"
                id="Breakfast"
                value={"Breakfast"}
                onChange={changeMealType}
              />
              <label className="labels">Breakfast</label>
              <input
                type="radio"
                name="mealType"
                id="Lunch"
                value={"Lunch"}
                onChange={changeMealType}
                required
              />
              <label className="labels">Lunch</label>
              <input
                type="radio"
                name="mealType"
                id="Dinner"
                value={"Dinner"}
                onChange={changeMealType}
                required
              />
              <label className="labels">Dinner</label>
            </Grid>
            <Grid item xs={12} md={12} className="flexCenter">
              <Grid
                className="flexCenter"
                style={{
                  width: "100%",
                  margin: "auto",
                }}
              >
                <input
                  className="search"
                  type="text"
                  placeholder="e.g. salad"
                  value={recipeSearchQuery}
                  onChange={(e) => setRecipeSearchQuery(e.target.value)}
                />
                <button className="search-button" onClick={handleSearch}>
                  search
                </button>
              </Grid>
            </Grid>
          </Grid>
        </Card>
        <br />

        <Grid container columns={{ xs: 4, sm: 8, md: 9, lg: 10 }}>
          {recipeResults === null
            ? "Search for something to find FOOOOOOOOOOOOD!"
            : recipeResults.map((result, indexed) => {
                return (
                  <Grid item xs={6} sm={4} md={3} lg={2}>
                    <div key={indexed}>
                      <Card
                        style={{
                          margin: "1rem 1rem",
                          borderRadius: 15,
                          backgroundColor: "#ded6ca",
                        }}
                      >
                        <CardMedia
                          sx={{ height: 180, opacity: "0.8" }}
                          image={result.recipe.images.REGULAR.url}
                        />

                        <CardContent>
                          <a
                            href={result.recipe.url}
                            target="_blank"
                            rel="noreferrer"
                            className="recipe-card-title"
                          >
                            <h2 style={{ margin: "0.8rem auto" }}>
                              Recipe {indexed + 1}
                            </h2>
                          </a>

                          <div className="labels">
                            <strong>Calories:</strong>{" "}
                            {result.recipe.calories.toFixed(0)}
                            <br />
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <div
                                className="recipe-link"
                                onClick={() => openModal(indexed)}
                              >
                                View ingredients
                              </div>
                              <Tooltip title="Save Recipe">
                                <IconButton
                                  id="save-recipe"
                                  onClick={() => openSaveOptions(indexed)}
                                >
                                  <AddIcon />
                                </IconButton>
                              </Tooltip>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <br />
                    </div>
                  </Grid>
                );
              })}
        </Grid>
      </div>

      {/* RENDERING "VIEW INGREDIENTS MODAL" */}
      {modalStatus && recipeResults && recipeResults[selectedRecipeIndex] && (
        <Modal
          open={modalStatus}
          onClose={closeModal}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "auto 1.5rem",
          }}
        >
          <TableContainer
            component={Paper}
            sx={{
              maxHeight: 550,
              maxWidth: 400,
            }}
          >
            <Table
              sx={{ maxWidth: 400 }}
              size="small"
              aria-label="a dense table"
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "25%" }}>
                    <strong>Ingredients</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableFooter>
                {recipeResults[selectedRecipeIndex].recipe.ingredientLines.map(
                  (ingredient, index) => (
                    <TableRow>
                      <TableCell key={index + 1}>{ingredient}</TableCell>
                    </TableRow>
                  )
                )}
              </TableFooter>
            </Table>
          </TableContainer>
        </Modal>
      )}
      {/* modal for saving choices*/}
      {saveModalStatus &&
        recipeResults &&
        recipeResults[selectedRecipeIndex] && (
          <Modal
            open={saveModalStatus}
            onClose={closeSaveModal}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "auto 1.5rem",
            }}
          >
            <Grid className="flexCenter">
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
                        <label>Recipe Name</label>
                        <br />
                        <input
                          className="meal-input"
                          type="text"
                          placeholder="e.g. Greek Salad"
                          value={recipeName}
                          onChange={(e) => setRecipeName(e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <label>Meal Type</label>
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
                  </TableHead>
                </Table>
                <div style={{ margin: 16 }}>
                  <div>
                    <strong>
                      Your Selection: Recipe {selectedRecipeIndex + 1}
                    </strong>
                  </div>
                  <img
                    src={
                      recipeResults[selectedRecipeIndex].recipe.images.SMALL.url
                    }
                    alt="imagehere"
                  />
                  <br />
                  <button className="recipe-button" onClick={saveTheRecipe}>
                    Save
                  </button>
                </div>
              </TableContainer>
            </Grid>
          </Modal>
        )}
    </div>
  );
}
