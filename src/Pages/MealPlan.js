import React, { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "../Components/Calendar";
import { Box, Grid, Modal, Typography } from "@mui/material";
import "../MealPlan.css";

// now... do you have the discipline to follow through?

export default function MealPlan() {
  const [ingredientSearchQuery, setIngredientSearchQuery] = useState("");
  const [totalResults, setTotalResults] = useState([]);
  const [displayData, setDisplayData] = useState(null);

  const [mealType, setMealType] = useState("");
  const [foodName, setFoodName] = useState("");
  const [addMeal, setAddMeal] = useState([]);

  const [openEditModal, setOpenEditModal] = useState(false);

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
          alert(
            "Oops, you caught us! We are still working to include all the ingredients!"
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

  const handleAddCalories = () => {
    const addCalories = displayData.reduce(
      (sum, result) => sum + result.calories,
      0
    );

    const newMealPlan = {
      typeOfMeal: mealType,
      nameOfFood: foodName,
      totalCalories: addCalories.toFixed(2),
    };

    setAddMeal([...addMeal, newMealPlan]);
    console.log(`new meal plan:`, newMealPlan);
    setMealType("");
    setFoodName("");
    setTotalResults([]);
  };

  // ===== FOR RENDERING MODAL ===== ///
  const handleOpenModal = () => {
    setOpenEditModal(true);
  };

  const handleCloseModal = () => {
    setOpenEditModal(false);
  };

  // ===== END ===== ///

  return (
    <div>
      {/* <h1>Meal Plan</h1> */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#efe9e0c8",
            color: "#42403F",
            margin: "2rem 2rem 0 2rem",
            borderRadius: "25px",
            width: "80%",
          }}
        >
          <div>
            Start planning your meal by searching up the ingredients!{" "}
            <button onClick={handleOpenModal}>Search</button>
            <Modal id="modal" open={openEditModal} onClose={handleCloseModal}>
              <Box className="modalBox">
                <p>Search</p>
                <Grid container spacing={2}>
                  <Grid
                    item
                    xs={12}
                    md={6}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="search"
                      value={ingredientSearchQuery}
                      onChange={(e) => setIngredientSearchQuery(e.target.value)}
                    />
                    <button onClick={handleSearch}>Add Item</button>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    {displayData && displayData.length > 0
                      ? displayData.map((data, index) => (
                          <div key={index + 1}>
                            <ul>
                              <li style={{ marginTop: "auto" }}>
                                {data.servingSize}g of {data.name}:{" "}
                                {data.calories}kcal
                              </li>
                            </ul>
                          </div>
                        ))
                      : null}
                  </Grid>
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={4}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <br />
                  <input
                    type="text"
                    value={foodName}
                    placeholder="Let's give it a name!"
                    onChange={(e) => setFoodName(e.target.value)}
                  />
                </Grid>
              </Box>
            </Modal>
          </div>
        </div>
      </div>

      <Calendar addMeal={addMeal} />

      <br />
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

      <label>Select Meal Time</label>
      <select value={mealType} onChange={(e) => setMealType(e.target.value)}>
        <option disabled value=""></option>
        <option value="breakfast">Breakfast</option>
        <option value="lunch">Lunch</option>
        <option value="dinner">Dinner</option>
      </select>

      <button onClick={handleAddCalories}>Add Meal</button>
      <button onClick={handleReset}>Reset Foods</button>
      <br />
      <br />
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
