import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { UserContext } from "../App";

//import our pages
import Home from "../Pages/Home";
import Landing from "../Pages/Landing";
import Dashboard from "../Pages/Dashboard";
import Login from "../Pages/Login";
import Signup from "../Pages/Signup";
import About from "../Pages/About";
import Posts from "../Pages/Posts";
import MealPlan from "../Pages/MealPlan";
import Recipe from "../Pages/Recipe";
import Contact from "../Pages/Contact";
import Profile from "../Pages/Profile";
import ErrorPage from "../Pages/ErrorPage";

export default function MunchRoutes(props) {
  const user = useContext(UserContext);

  function RequireAuth({ children, redirectTo }) {
    const isAuthenticated = user.isLoggedIn;
    return isAuthenticated ? children : <Navigate to={redirectTo} />;
  }
  // remember to pass setStates as props.setStates to the element you wish to pass this parent function to
  return (
    <>
      <Routes>
        <Route path="/landing" element={<Landing />} />
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
        {/* ONLY LOGGED IN USERS CAN ACCESS TO FOLLOWING PAGES */}
        <Route
          path="/"
          element={
            <RequireAuth redirectTo="/landing">
              <Home />
            </RequireAuth>
          }
        />
        {/* Connie: Should we rename as /users/pagename for these or? Which ones should we do as nested routes? */}
        {/* J: hmm, do yall think the following routes should be nested under Home page so that only logged in users can access them? */}
        <Route
          path="/profile"
          element={<Profile setStates={props.setStates} />}
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mealplan" element={<MealPlan />} />
        <Route
          path="/recipe"
          element={<Recipe dataFromRecipe={props.dataFromRecipe} />}
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
}
