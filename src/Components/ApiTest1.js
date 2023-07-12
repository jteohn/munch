import { React, useState } from "react";
import axios from "axios";

function ApiTest() {
  const [input, setInput] = useState("");

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchString = input;
    axios({
      method: "get",
      headers: { "X-Api-Key": process.env.REACT_APP_CALORIENINJA_KEY },
      url: `https://api.calorieninjas.com/v1/nutrition?query=${searchString}`,
      contentType: "application/json",
    })
      .then((data) => {
        setInput("");
      })
      .catch((error) => {
        return;
      });
  };

  return (
    <div>
      <div>API TEST</div>
      <div>
        <div>CalorieNinja API TEST</div>
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
