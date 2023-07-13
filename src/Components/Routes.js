import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
// import { UserContext } from "../App";

//import our pages
// import Home from "../Pages/Home";
import Landing from "../Pages/Landing";
import Dashboard from "../Pages/Dashboard";
import Login from "../Pages/Login";
import Signup from "../Pages/Signup";
import About from "../Pages/About";
import Posts from "../Pages/Posts";
import MealPlan from "../Pages/MealPlan";
import Recipe from "../Pages/Recipe";
import Profile from "../Pages/Profile";
import ErrorPage from "../Pages/ErrorPage";

export default function MunchRoutes(props) {
  // remember to pass setStates as props.setStates to the element you wish to pass this parent function to
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/signup"
          element={
            <Signup
              handleSignup={props.handleSignup}
              setStates={props.setStates}
            />
          }
        />
        <Route
          path="/login"
          element={<Login handleLogin={props.handleLogin} />}
        />
        <Route path="/mealplan" element={<MealPlan />} />
        <Route
          path="/profile"
          element={<Profile setStates={props.setStates} />}
        />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="/recipe"
          element={<Recipe dataFromRecipe={props.dataFromRecipe} />}
        />
        <Route path="/about" element={<About />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
}
