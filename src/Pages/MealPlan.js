import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Calendar from "../Components/Calendar";
import {
  Box,
  Card,
  Grid,
  Modal,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Swal from "sweetalert2";
import "../MealPlan.css";
import { database } from "../firebase";
import { push, ref } from "firebase/database";
import { UserContext } from "../App";

// now... do you have the discipline to follow through?

export default function MealPlan() {
  const [ingredientSearchQuery, setIngredientSearchQuery] = useState("");
  const [totalResults, setTotalResults] = useState([]);
  const [displayData, setDisplayData] = useState(null);

  const [mealType, setMealType] = useState("");
  const [foodName, setFoodName] = useState("");
  const [addMeal, setAddMeal] = useState([]);

  const [isButtonDisabled, setIsButtonDisable] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const user = useContext(UserContext);
  const DB_SAVEMEAL_KEY = "userSavedMeal/";

  // ===== PERFORM SEARCH + EXTRACT INFO FROM API ===== //
  const handleSearch = (e) => {
    e.preventDefault();
    // added isButtonDisable so that the 'search' button is temporarily disabled while data is being pulled from API
    setIsButtonDisable(true);
    axios({
      method: "get",
      headers: { "X-Api-Key": process.env.REACT_APP_CALORIENINJA_KEY },
      url: `https://api.calorieninjas.com/v1/nutrition?query=${ingredientSearchQuery}`,
      contentType: "application/json",
    })
      .then((result) => {
        // added a condition to check if the item exists in our API.
        if (result.data.items.length === 0) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Oops, You caught us!",
            text: "We are continuously working to expand our database and include more ingredients!",
          });
        } else {
          setTotalResults((prevResults) => [...prevResults, result.data]);
          setIsButtonDisable(false);
        }
        setIngredientSearchQuery("");
      })
      .catch((error) => {
        console.log(`error: ${error}`);
      });
  };

  useEffect(() => {
    console.log("Updated totalResults:", totalResults);
  }, [totalResults]);

  const handleReset = (e) => {
    setTotalResults([]);
  };

  // ===== TO CONVERT THE EXTRACTED API DATA ===== //
  // display results from totalResults array & update the displayData state with the transformed data.
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
    setIsButtonDisable(false);
  }, [totalResults]);

  // ===== FUNCTION TO SUM UP CALORIES ===== //
  const calculateTotalCalories = (data) => {
    if (displayData && displayData.length > 0) {
      const calculateCalories = displayData.reduce(
        (sum, result) => sum + result.calories,
        0
      );
      return calculateCalories.toFixed(2);
    } else {
      return 0;
    }
  };

  // ===== TO STORE SAVED MEAL IN DATABASE ===== //
  const writeData = (newMealPlan) => {
    const { typeOfMeal, nameOfFood, totalCalories } = newMealPlan;

    const addMealRef = ref(database, DB_SAVEMEAL_KEY + user.uid);

    push(addMealRef, {
      typeOfMeal,
      nameOfFood,
      totalCalories,
    })
      .then(() => {
        console.log(`Saved meal has been added to database`);
      })
      .catch((error) => {
        console.log(`Error. Unable to add saved meal to database`);
      });
  };

  // ===== FUNCTION TO HANDLE MISSING INPUT(S) FROM USER WHEN SAVING MEAL ===== //
  const inputValidation = () => {
    if (!mealType || !foodName) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Oops!",
        text: "Please enter both the meal type and food name!",
      });
      return false;
    }
    return true;
  };

  // ===== FUNCTION TO PASS SAVE MEAL DATA TO CALENDAR ===== //
  const handleAddCalories = () => {
    const addCalories = calculateTotalCalories(displayData);

    if (!inputValidation()) {
      return;
    }

    const newMealPlan = {
      typeOfMeal: mealType,
      nameOfFood: foodName,
      totalCalories: addCalories,
    };

    writeData(newMealPlan);
    setAddMeal([...addMeal, newMealPlan]);

    Swal.fire({
      position: "center",
      icon: "success",
      title: "Saved!",
      text: "You can now add it to your calendar.",
    });

    // console.log(`new meal plan:`, newMealPlan);
    setMealType("");
    setFoodName("");
    setTotalResults([]);
  };

  // ===== DELETE HANDLER FOR USER TO REMOVE AN ITEM FROM THEIR LIST ===== //
  const handleDeleteRow = (index) => {
    setDisplayData((prevData) => {
      const newData = [...prevData];
      newData.splice(index, 1);
      return newData;
    });

    setTotalResults((prevResults) => {
      const newResults = [...prevResults];
      newResults.splice(index, 1);
      return newResults;
    });
  };

  // ===== FOR RENDERING MODAL ===== //
  const handleOpenModal = () => {
    setOpenEditModal(true);
  };

  const handleCloseModal = () => {
    setOpenEditModal(false);
  };

  // ===== FOR RENDERING TABLE IN MODAL ===== //
  const displayTable = (
    <TableContainer
      component={Paper}
      sx={{ maxWidth: 500, borderRadius: "20px" }}
    >
      <Table sx={{ maxWidth: 500 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: "25%" }}>
              <strong>Item</strong>
            </TableCell>
            <TableCell sx={{ width: "30%" }}>
              <strong>Serving Size</strong>
            </TableCell>
            <TableCell>
              <strong>Calories (kcal)</strong>
            </TableCell>
            <TableCell align="right">
              <Tooltip title="Reset all">
                <RestartAltIcon
                  onClick={handleReset}
                  sx={{
                    color: "#797675",
                  }}
                />
              </Tooltip>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableFooter>
          {displayData && displayData.length > 0
            ? displayData.map((data, index) => (
                <TableRow key={index + 1}>
                  <TableCell>{data.name}</TableCell>
                  <TableCell>{data.servingSize}</TableCell>
                  <TableCell>{data.calories}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Delete">
                      <RemoveCircleIcon
                        sx={{
                          color: "#DED6CA",
                        }}
                        onClick={() => handleDeleteRow(index)}
                      />
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            : null}
          <TableRow>
            <TableCell colSpan={2}>
              <div>
                <strong>Total Calories</strong>
              </div>
            </TableCell>
            <TableCell>
              <strong>{calculateTotalCalories()}</strong>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
  // ===== END ===== //

  return (
    <div>
      <div className="flexCenter">
        <Card id="card">
          <div style={{ textAlign: "center" }}>
            Start planning your meal by searching up the ingredients! <br />
            <button className="track-button" onClick={handleOpenModal}>
              Track Calorie Consumption
            </button>
          </div>
        </Card>
        <Modal
          id="modal-container"
          open={openEditModal}
          onClose={handleCloseModal}
        >
          <Box className="modal-box">
            <h3 className="font">Track Your Calorie Consumption</h3>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12} className="flexCenter">
                <input
                  className="search"
                  type="text"
                  placeholder="e.g. 100g chicken"
                  value={ingredientSearchQuery}
                  onChange={(e) => setIngredientSearchQuery(e.target.value)}
                />
                <button
                  className="search-button"
                  onClick={handleSearch}
                  disabled={isButtonDisabled}
                >
                  search
                </button>
                {console.log(`isButtonDisabled`, isButtonDisabled)}
              </Grid>
            </Grid>
            <br />

            {/* NOTE: THIS SECTION IS FOR RENDERING 'ADD MEAL' FORM */}
            {displayData && displayData.length > 0 && displayTable}
            <br />
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
                      <TableCell sx={{ width: "40%" }}>
                        <label>Food Name</label>
                        <input
                          className="meal-input"
                          type="text"
                          value={foodName}
                          placeholder="e.g. salad"
                          onChange={(e) => setFoodName(e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <label>Meal Type</label>{" "}
                        <select
                          value={mealType}
                          onChange={(e) => setMealType(e.target.value)}
                        >
                          <option disabled value=""></option>
                          <option value="Breakfast">Breakfast</option>
                          <option value="Lunch">Lunch</option>
                          <option value="Dinner">Dinner</option>
                        </select>
                      </TableCell>
                      <TableCell>
                        <button
                          className="button desktop"
                          onClick={handleAddCalories}
                        >
                          Save
                        </button>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                </Table>
                <button className="button mobile" onClick={handleAddCalories}>
                  Save
                </button>
              </TableContainer>
            </Grid>
          </Box>
        </Modal>
      </div>
      <br />
      {/* NOTE: PASSING ADDMEAL TO CALENDAR.JS */}
      <Calendar addMeal={addMeal} />
      <br />
    </div>
  );
}
