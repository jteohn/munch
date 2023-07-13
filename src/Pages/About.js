import React from "react";
import { Box, Container, Grid, useMediaQuery } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import recipelogo from "../assets/recipelogo.png";
import ingredients from "../assets/ingredients.png";
import mealplan from "../assets/mealplan.png";

// this can be a page about us? 🤗

export default function About() {
  const isLargeScreen = useMediaQuery("(min-width: 960px)");

  return (
    <div>
      <div>
        <h1
          className="flexCenter"
          style={{
            fontFamily: "Inria Serif",
            fontWeight: "600",
            color: "#42403f",
            fontSize: "2.5rem",
            margin: "3rem auto",
          }}
        >
          About Munch!
        </h1>
      </div>
      <Grid>
        <Grid className="flexCenter">
          <Card
            id="recipe-container"
            style={{
              margin: "auto 1.5rem",
              borderRadius: 15,
              display: "flex",
              backgroundColor: "#FFF",
              width: "70%",
              justifyContent: "space-evenly",
              flexDirection: isLargeScreen ? "row" : "column",
            }}
          >
            <div
              style={{ maxWidth: isLargeScreen ? "40%" : "", color: "#42403f" }}
            >
              <h3>Our Story</h3>
              <p className="labels">
                Created by 3 friends, munch was born out of a hunger to make
                health goals achievable. Munch is an app that helps you search
                recipes, create recipes, make meal plans and create your own
                meal plan calendar. Using our recipe and ingredients database,
                you can calculate the calories to track your intake.
              </p>
            </div>
            <div
              style={{
                color: "#42403f",
                width: isLargeScreen ? "40%" : "",
              }}
            >
              <h3>Our Features</h3>
              <div
                style={{
                  display: "flex",

                  justifyContent: "space-between",
                }}
              >
                <div>
                  <img
                    src={recipelogo}
                    alt="recipe"
                    height="90px"
                    style={{ opacity: "0.9" }}
                  />
                  <div className="labels">2.3 million recipes</div>
                </div>
                <div>
                  <img
                    src={ingredients}
                    alt="ingredients"
                    height="90px"
                    style={{ opacity: "0.9" }}
                  />
                  <div className="labels">100,000+ ingredients</div>
                </div>
                <div>
                  <img
                    src={mealplan}
                    alt="mealplan"
                    height="90px"
                    style={{ opacity: "0.9" }}
                  />
                  <div className="labels">Create meal plans</div>
                </div>
              </div>
            </div>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
