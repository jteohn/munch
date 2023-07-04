import { React, useState } from "react";
import axios from "axios";

function ApiTest() {
  const [input, setInput] = useState("");
  const [mealType, setMealType] = useState("Lunch");

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchString = input;
    axios
      .get(
        `https://api.edamam.com/api/recipes/v2?type=public&q=${searchString}&app_id=${process.env.REACT_APP_EDAMAM_RECIPE_ID}&app_key=${process.env.REACT_APP_EDAMAM_RECIPE_KEY}&diet=balanced&mealType=${mealType}&dishType=Main%20course&dishType=Salad&dishType=Soup&dishType=Starter&imageSize=REGULAR&field=uri&field=image&field=images&field=source&field=url&field=ingredientLines&field=ingredients&field=calories&field=totalWeight&field=totalTime&field=mealType&field=totalNutrients&field=totalDaily`
      )
      .then((data) => {
        console.log(data);
        setInput("");
      })
      .catch((error) => {
        console.log(`error: ${error}`);
      });
  };

  return (
    <div>
      <div>
        <div>Edamam API TEST</div>
        <input
          type="text"
          placeholder="search"
          value={input}
          onChange={(e) => handleChange(e)}
        />
        <input type="submit" value="submit" onClick={handleSubmit} />
      </div>
    </div>
  );
}

export default ApiTest;
