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

  // Connie: We can create a context to pass global variables around like isLoggedIn, userName, uid
  // J: added all except uid! not too sure what's that!

  // J: Added RequireAuth implementation to check if isLoggedIn is true, otherwise, redirect user to Landing page.
  function RequireAuth({ children, redirectTo }) {
    const isAuthenticated = user.isLoggedIn;
    return isAuthenticated ? children : <Navigate to={redirectTo} />;
  }

  return (
    <>
      {user.isPageLoading ? (
        <p style={{ textAlign: "center", marginTop: "2rem" }}>
          Page Loading...
        </p>
      ) : (
        <Routes>
          <Route path="/landing" element={<Landing />} />
          <Route
            path="/signup"
            element={<Signup handleSignup={props.handleSignup} />}
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
<<<<<<< HEAD
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
=======
          <Route
            path="/profile"
            element={
              <Profile
                name={name}
                email={email}
                password={password}
                height={height}
                weight={weight}
                gender={gender}
                age={age}
              />
            }
          />
          <Route path="/dashboard" element={<Dashboard name={name} />} />
>>>>>>> main
          <Route path="/mealplan" element={<MealPlan />} />
          <Route path="/recipe" element={<Recipe />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      )}
    </>
  );
}

// J: Previous code, in case we need for ref?
// <Route
//         path="/"
//         element={
//           <RequireAuth redirectTo="/landing">
//             <Home />
//           </RequireAuth>
//         }
//       />

//       {/* Should we rename as /users/pagename for these or? Which ones should we do as nested routes? */}
//       {/* J: hmm, do yall think the following routes should be nested under Home page so that only logged in users can access them? */}
//       <Route
//         path="/profile"
//         element={
//           <Profile
//             name={name}
//             height={height}
//             weight={weight}
//             gender={gender}
//             age={age}
//           />
//         }
//       />
//       <Route path="/dashboard" element={<Dashboard />} />
//       <Route path="/mealplan" element={<MealPlan />} />
//       <Route path="/recipe" element={<Recipe />} />
//       <Route path="/about" element={<About />} />
//       <Route path="/contact" element={<Contact />} />
//       <Route path="/posts" element={<Posts />} />
//       <Route path="*" element={<ErrorPage />} />
//     </Routes>
