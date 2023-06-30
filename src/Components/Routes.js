import React from "react";
import { Routes, Route } from "react-router-dom";

//import our pages
import Home from "../Pages/Home";
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
  // We can create a context to pass global variables around like isLoggedIn, userName, uid

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup signup={props.handleSignup} />} />
      <Route
        path="/login"
        element={<Login handleLogin={props.handleLogin} />}
      />

      {/* Should we rename as /users/pagename for these or? Which ones should we do as nested routes? */}
      <Route path="/profile" element={<Profile currUser={props.currUser} />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/mealplan" element={<MealPlan />} />
      <Route path="/recipe" element={<Recipe />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/posts" element={<Posts />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}
