import React from "react";
import { Box, Container } from "@mui/material";
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
  return (
    <div style={{ width: `100%` }}>
      <Box
        sx={{
          display: `flex`,
          m: 3,
          p: 3,
          bgcolor: `#fff`,
          color: `grey.800`,
          fontSize: `2.5rem`,
          fontWeight: `700`,
          fontFamily: "Inria Serif",
        }}
      >
        <h1>about munch</h1>
        <Box
          sx={{
            display: `flex`,
            m: 1,
            p: 5,
            bgcolor: `#fff`,
            color: `grey.800`,
            fontSize: `1rem`,
            fontWeight: `400`,
            fontFamily: "Inria Serif",
          }}
        >
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <Typography variant="h4" fontFamily={"Inria Serif"}>
                    What is munch?
                  </Typography>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1" fontFamily={"Inria Serif"}>
                      Created by 3 friends, munch was borne out of a hunger to
                      make health goals achievable. Munch is an app that helps
                      you search recipes, create recipes, make meal plans and
                      create your own meal plan calendar. Using our recipe and
                      ingredients database, you can calculate the calories to
                      track your intake.
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <Typography variant="h4" fontFamily={"Inria Serif"}>
                    <br />
                    Features in munch?
                  </Typography>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Card sx={{ maxWidth: 200 }}>
                      <CardMedia
                        sx={{ height: 200 }}
                        image={recipelogo}
                        title="recipe"
                      />
                      <CardContent>
                        <Typography
                          textAlign="center"
                          gutterBottom
                          variant="h5"
                          component="div"
                          fontFamily={"Inria Serif"}
                        >
                          2.3 million recipes
                        </Typography>
                      </CardContent>
                    </Card>
                  </TableCell>

                  <TableCell>
                    <Card sx={{ maxWidth: 200 }}>
                      <CardMedia
                        sx={{ height: 200 }}
                        image={ingredients}
                        title="ingredients"
                      />
                      <CardContent>
                        <Typography
                          textAlign="center"
                          gutterBottom
                          variant="h5"
                          component="div"
                          fontFamily={"Inria Serif"}
                        >
                          100,000+ ingredients
                        </Typography>
                      </CardContent>
                    </Card>
                  </TableCell>
                  <TableCell>
                    <Card sx={{ maxWidth: 200 }}>
                      <CardMedia
                        sx={{ height: 200 }}
                        image={mealplan}
                        title="mealplan"
                      />
                      <CardContent>
                        <Typography
                          textAlign="center"
                          gutterBottom
                          variant="h5"
                          component="div"
                          fontFamily={"Inria Serif"}
                        >
                          Create meal plans
                        </Typography>
                      </CardContent>
                    </Card>
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </div>
  );
}
