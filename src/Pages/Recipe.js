// import React, { useState } from "react";
// import axios from "axios";
// import { Card } from "react-bootstrap";
// import { Modal } from "react-responsive-modal";
// import { Button } from "react-bootstrap";
// import "react-responsive-modal/styles.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// export default function Recipe() {
//   const [recipeSearchQuery, setRecipeSearchQuery] = useState("");
//   const [mealTypeQuery, setMealTypeQuery] = useState("Breakfast");
//   const [modalStatus, setModalStatus] = useState(false);
//   const [recipeResults, setRecipeResults] = useState(null);
//   const [selectedRecipeIndex, setSelectedRecipeIndex] = useState(null);

//   const openModal = (index) => {
//     console.log("setModalStatus set to true");
//     setSelectedRecipeIndex(index);
//     setModalStatus(true);
//   };
//   const closeModal = () => setModalStatus(false);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     console.log(`mealTypeQuery: ${mealTypeQuery}`);
//     console.log(`recipeSearchQuery: ${recipeSearchQuery}`);
//     axios
//       .get(
//         `https://api.edamam.com/api/recipes/v2?type=public&q=${recipeSearchQuery}&app_id=${process.env.REACT_APP_EDAMAM_RECIPE_ID}&app_key=${process.env.REACT_APP_EDAMAM_RECIPE_KEY}&diet=balanced&mealType=${mealTypeQuery}&dishType=Main%20course&dishType=Salad&dishType=Soup&dishType=Starter&imageSize=REGULAR&field=uri&field=image&field=images&field=source&field=url&field=ingredientLines&field=calories&field=totalWeight&field=totalTime&field=mealType&field=totalNutrients&field=totalDaily`
//       )
//       .then((result) => {
//         setRecipeSearchQuery("");
//         console.log(result.data.hits);
//         const savedRecipes = result.data.hits;
//         setRecipeResults(savedRecipes);
//       })
//       .catch((error) => {
//         console.log(`error: ${error}`);
//       });
//   };
//   const changeMealType = (e) => {
//     setMealTypeQuery(e.target.value);
//   };
//   return (
//     <div>
//       <h1>Recipes!</h1>

//       <div>
//         <form>
//           <label>Select Meal Time</label>
//         </form>
//         <select value={mealTypeQuery} onChange={changeMealType}>
//           <option value={"Breakfast"}>Breakfast</option>
//           <option value={"Lunch"}>Lunch</option>
//           <option value={"Dinner"}>Dinner</option>
//         </select>
//       </div>
//       <br />
//       <div>
//         <input
//           type="text"
//           placeholder="search"
//           value={recipeSearchQuery}
//           onChange={(e) => setRecipeSearchQuery(e.target.value)}
//         />
//         <input type="submit" value="submit" onClick={handleSearch} />
//       </div>
//       <div>
//         {recipeResults === null
//           ? "No Search Active!"
//           : recipeResults.map((result, indexed) => {
//               return (
//                 <div key={indexed}>
//                   <Card>
//                     <Card.Img
//                       variant="top"
//                       src={result.recipe.images.THUMBNAIL.url}
//                       alt=""
//                       style={{ height: "100px", width: "100px" }}
//                     />
//                     <Card.Title>
//                       <a href={result.recipe.url}>Recipe {indexed + 1}</a>
//                     </Card.Title>
//                     <Card.Text>
//                       <div>Calories: {result.recipe.calories.toFixed(0)}</div>
//                       <Button
//                         variant="primary"
//                         onClick={() => openModal(indexed)}
//                       >
//                         Ingredient List
//                       </Button>
//                       {modalStatus &&
//                         recipeResults &&
//                         recipeResults[selectedRecipeIndex] && (
//                           <Modal open={modalStatus} onClose={closeModal} center>
//                             <h2>Ingredients:</h2>
//                             <ul>
//                               {recipeResults[
//                                 selectedRecipeIndex
//                               ].recipe.ingredientLines.map(
//                                 (ingredient, index) => (
//                                   <li key={index + 1}>{ingredient}</li>
//                                 )
//                               )}
//                             </ul>
//                           </Modal>
//                         )}
//                     </Card.Text>
//                   </Card>
//                 </div>
//               );
//             })}
//       </div>
//     </div>
//   );
// }
