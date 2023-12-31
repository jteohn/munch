import React, { useEffect, useState, useContext } from "react";
import { ref, set, get, update, onValue } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { database } from "../firebase";
import { UserContext } from "../App";
import { useNavigate, HistoryRouter } from "react-router-dom";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import PreviewIcon from "@mui/icons-material/Preview";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";

import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { StartwoTone } from "@mui/icons-material";
import {
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
} from "@mui/material";
// import dayjs from "dayjs";

export default function Calendar() {
  const user = useContext(UserContext);
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState(new Date());
  // const [newDate, setNewDate] = useState("");

  // setDatabase reference
  const DB_CALENDAR_KEY = "userCalendar/";
  const userRef = ref(database, DB_CALENDAR_KEY + user.uid);

  // Receive data from MealPlan.js
  const [savedMealData, setSavedMealData] = useState({});
  const [selectedMeal, setSelectedMeal] = useState(null);
  const DB_SAVEMEAL_KEY = "userSavedMeal/";

  // const browserHistory = createBrowserHistory({window});

  // initialize popup values
  const [open, setOpen] = useState(false);

  // initialize form inputs for dateClick
  const [mealType, setMealType] = useState("");
  const [calories, setCalories] = useState("");
  const [foodName, setFoodName] = useState("");
  const [recipeURL, setRecipeURL] = useState("");
  const [start, setStart] = useState("");
  const [startStr, setStartStr] = useState("");
  const [eventInfo, setEventInfo] = useState({});
  const [count, setCount] = useState(1);
  const [currentEventID, setCurrentEventID] = useState(0);
  const [mode, setMode] = useState("");
  const [dbSnapshot, setDbSnapshot] = useState([]);
  const [firstTime, setFirstTime] = useState(true);

  const [events, setEvents] = useState([]);
  const [today] = useState(new Date());
  const [yesterday] = useState(new Date() - 1);

  // to reset input fields after event is saved
  const resetFields = () => {
    setMealType("");
    setCalories("");
    setFoodName("");
    setRecipeURL("");
    setStart("");
    setStartStr("");
    // setMode("");
    setFirstTime(false);
    console.log("Fields are reset, open is : ", open);
  };

  // when user clicks on "Add Meal" button
  const chooseDateHandler = () => {
    if (!user.isLoggedIn) {
      Swal.fire({
        icon: "error",
        title: "Sorry...",
        text: "You cannot add a meal if you are not logged in. Please login! ",
        footer: `<a href="./login">Go to Login</a>`,
      }).then(() => {
        return;
      });
    }
    setMode("newmeal");
    setStart("");
    setOpen(true);
    console.log("Adding a new meal...", mode);
  };

  // when user clicks on any dates on the calendar
  const dateClickHandler = (info) => {
    if (!user.isLoggedIn) {
      Swal.fire({
        icon: "error",
        title: "Sorry...",
        text: "You cannot add a meal if you are not logged in. Please login! ",
        footer: `<a href="./login">Go to Login</a>`,
      }).then(() => {
        return;
      });
    }
    const entereddate = new Date(info.startStr);

    if (entereddate < yesterday) {
      Swal.fire({
        icon: "error",
        title: "Sorry...",
        text: "You cannot add a meal to a past date.",
      }).then(() => {
        return;
      });
    }
    setMode("newdate");
    setOpen(true);
    console.log("Selecting Date...");
    let date = info.start;
    const dateStr = info.startStr;
    date = `${dateStr}T00:00:00`;
    setStartStr(dateStr);
    setStart(date);
    console.log("User selected date:", date);
    console.log("All info is : ", info);
  };

  // when user clicks on event
  const eventsHandler = (info) => {
    if (!user.isLoggedIn) {
      Swal.fire({
        icon: "error",
        title: "Sorry...",
        text: "You cannot add a meal if you are not logged in. Please login! ",
        footer: `<a href="./login">Go to Login</a>`,
      }).then(() => {
        return;
      });
    }
    const entereddate = new Date(info.startStr);
    if (entereddate < yesterday) {
      Swal.fire({
        icon: "error",
        title: "Sorry...",
        text: "You cannot add a meal to a past date.",
      }).then(() => {
        return;
      });
    }
    setMode("editevent");

    setOpen(true);
    const event = info.event._def;

    setCurrentEventID(event.publicId);
    setEventInfo(event);

    const title = event.title;
    const date = info.event.startStr.substring(0, 10);
    const start = info.event.startStr.substring(0, 19);
    setStartStr(date);

    const extendedProps = event.extendedProps;

    setStart(start);
    setMealType(title);
    setCalories(extendedProps.calories);
    setFoodName(extendedProps.Food);
    setRecipeURL(extendedProps.recipeURL);
  };

  // to change start date from mini calendar into format for big calendar
  useEffect(() => {
    const year = startDate.toLocaleDateString("default", { year: "numeric" });
    const month = startDate.toLocaleDateString("default", { month: "2-digit" });
    const day = startDate.toLocaleDateString("default", { day: "2-digit" });
    const date = [year, month, day].join("-");

    setStartStr(date);
  }, [startDate]);

  useEffect(() => {
    console.log(mealType);
    if (mealType === "Breakfast") {
      setStart(`${startStr}T06:00:00`);
    } else if (mealType === `Lunch`) {
      setStart(`${startStr}T12:00:00`);
    } else if (mealType === `Dinner`) {
      setStart(`${startStr}T18:00:00`);
    }
  }, [mealType]);

  // when page loads runs once to get snapshot
  useEffect(() => {
    onAuthStateChanged(auth, (currUser) => {
      if (currUser) {
        setCount(events.length);
        get(userRef).then((snapshot) => {
          const snapshott = snapshot.val();
          if (snapshot.exists()) {
            setDbSnapshot(snapshott);

            if (snapshott && Array.isArray(snapshott.events)) {
              console.log("Success!!!!!");
              setEvents(snapshott.events);
              setFirstTime(false);
              console.log(events);
              return;
            }
          } else {
            setFirstTime(false);
            return;
          }
        });
      } else {
        navigate("/");
      }
    });
  }, []);

  useEffect(() => {
    setCount(events.length);
    if (!firstTime && mode !== "deleteevent") {
      const newEvents = events;
      get(userRef).then((snapshot) => {
        // const snapshott = snapshot.val();

        // const snapshott = snapshot.val();
        if (snapshot.exists()) {
          update(userRef, { events: newEvents });
        } else {
          set(userRef, {
            events: newEvents,
          });
        }
      });
    } else if (mode === "deleteevent") {
      const newEvents = events;
      set(userRef, {
        events: newEvents,
      });
      // check snapshot after replacing
      get(userRef).then((snapshot) => {
        const snapshott = snapshot.val();
        console.log("After delete snapshot : ", snapshott);
      });
    }
  }, [events]);

  // to enable user to close pop ups without saving by clicking anywhere on document
  const handleClosePopupWithoutSubmit = () => {
    setOpen(false);
    resetFields();
  };

  // when delete event button is clicked on event popup
  const handleDeleteEvent = () => {
    setOpen(false);
    setMode("deleteevent");

    const eventsCopy = [...events];
    eventsCopy.splice(currentEventID, 1);
    let counter = currentEventID;

    while (counter < eventsCopy.length) {
      eventsCopy[counter].id = counter;

      counter++;
    }
    setEvents(eventsCopy);
  };

  // to render each event in calendar
  const renderEventContent = (eventInfo) => {
    return (
      <div>
        <b>{eventInfo.event.title} </b>
        <i>{eventInfo.event.extendedProps.Food}</i>
      </div>
    );
  };

  // handle all submit buttons for pop up
  const handlePopupSubmit = () => {
    if (mealType === "" || foodName === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please ensure you select the meal time and plan before submitting the form.",
      }).then(() => {
        setOpen(true);
        console.log("Open is : ", open);
        console.log("Mode is : ", mode);
        setMode("newmeal");
        Swal.close();
      });
    }
    setOpen(false);
    setCount(events.length);

    if (mode === "editevent") {
      const eventsCopy = [...events];

      const currentEvent = {
        id: currentEventID,
        extendedProps: {
          Food: foodName,
          recipeURL: recipeURL,
          calories: calories,
          start: start,
        },
        title: mealType,
        start: start,
      };

      eventsCopy[currentEventID] = currentEvent;

      setEvents(eventsCopy);
    } else if (mode === "newdate" || mode === "newmeal") {
      if (foodName) {
        setEvents((prevEvents) => [
          ...prevEvents,
          {
            id: count,
            start,
            title: mealType,
            extendedProps: {
              Food: foodName,
              recipeURL: recipeURL,
              calories: calories,
              start: start,
            },
          },
        ]);
      }
    }
    resetFields();
  };

  //event drop
  const updateEventOnDragged = (eventInfo) => {
    let newStartStr = eventInfo.event.startStr;
    newStartStr = newStartStr.substring(0, 19);
    const eventID = eventInfo.event.id;

    setMode("deleteevent");

    const eventsCopy = [...events];
    eventsCopy[eventID].start = newStartStr;
    eventsCopy[eventID].extendedProps.start = newStartStr;

    setEvents(eventsCopy);
  };

  // ===== BELOW SECTION IS FOR RENDERING OUT POPULATED FIELD BASED ON WHAT USER HAS ADDED FROM MEALPLAN.JS ===== //
  // update useEffect to display saved meal(s) in Calendar.js
  useEffect(() => {
    const addMealRef = ref(database, DB_SAVEMEAL_KEY + user.uid);

    onValue(addMealRef, (snapshot) => {
      const data = snapshot.val();
      // console.log(`extract saved meals data:`, data);
      if (data !== null) {
        const addMealArray = Object.values(data);
        setSavedMealData(addMealArray);
      } else {
        setSavedMealData([]);
      }
    });
  }, []);

  // update setMealType, setFoodName, and setCalories with the saved meal(s) data extracted from database.
  useEffect(() => {
    if (selectedMeal) {
      setMealType(selectedMeal.typeOfMeal);
      setFoodName(selectedMeal.nameOfFood);
      setCalories(selectedMeal.totalCalories);
      setRecipeURL(selectedMeal.url);
    }
  }, [selectedMeal]);

  // onClick handler to auto-populate the fields
  const handleSelectMeal = (meal) => {
    setSelectedMeal(meal);
  };

  // ===== FOR RENDERING TABLE IN MODAL ===== //
  const displayTable = (
    <TableContainer
      component={Paper}
      sx={{
        maxWidth: 350,
        borderRadius: "10px",
        maxHeight: 100,
        margin: "0",
        width: "80%",
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#EFE9E0" }}>
            <TableCell sx={{ width: "20%" }} align="center">
              <strong>Saved Meal List</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableFooter>
          {Object.values(savedMealData).map((meal, index) => {
            return (
              <TableRow key={index}>
                <TableCell
                  className="select-meal"
                  align="center"
                  onClick={() => handleSelectMeal(meal)}
                >
                  {meal.nameOfFood}
                </TableCell>
              </TableRow>
            );
          })}
        </TableFooter>
      </Table>
    </TableContainer>
  );
  // ===== END OF SECTION ===== //

  return (
    <div style={{ justifyContent: "center", padding: "1.5rem" }}>
      <Fullcalendar
        id="calender"
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: "dayGridMonth dayGridWeek",
          center: "title",
          end: "new",
        }}
        footerToolbar={{
          // start: "dayGridMonth dayGridWeek",
          end: "today prev next",
        }}
        nowIndicator={true}
        minDate={today}
        selectable={true}
        editable={true}
        events={events}
        height={"90vh"}
        customButtons={{
          new: {
            text: "Add Meal",
            click: () => chooseDateHandler(),
          },
        }}
        eventDrop={(info) => updateEventOnDragged(info)}
        select={(info) => dateClickHandler(info)}
        eventClick={(info) => eventsHandler(info)}
        eventContent={renderEventContent}
      />

      {/* dynamic popup for date click / current event click / add meal button click */}
      <Popup
        open={open}
        closeOnDocumentClick
        onClose={handleClosePopupWithoutSubmit}
      >
        <div id="modal-container" style={{ width: "100%" }}>
          <div className="modal-box" style={{ backgroundColor: "#fbf7f1" }}>
            {mode === "newdate" ? (
              <div>
                <div className="font displaytext">
                  {startStr !== "" ? (
                    <div>Add a meal to your calendar on {startStr}.</div>
                  ) : (
                    <div>Add a meal to your calendar</div>
                  )}
                </div>
                <div className="smallFont displaytext" style={{ margin: 0 }}>
                  You can choose from your list or fill up the form below:
                </div>
              </div>
            ) : mode === "editevent" ? (
              <div>
                <div className="font displaytext">Edit Meal</div>
                <div className="smallFont displaytext" style={{ margin: 0 }}>
                  Please save the form if you have made any changes!
                </div>
              </div>
            ) : (
              <div>
                <div className="font displaytext">
                  Add a meal to your calendar
                </div>
                <div className="smallFont displaytext" style={{ margin: 0 }}>
                  You can choose from your list or fill up the form below:
                </div>
              </div>
            )}
            <br />

            {/* {renderPopulatedFields} */}
            {displayTable}

            <br />
            {/* BODY */}
            <div className="flexCenter">
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "column",
                  }}
                >
                  {mode === "newmeal" ? (
                    <div>
                      <div id="addMealForm-title">Date of Meal *</div>
                      <div id="addMealForm-input">
                        <DatePicker
                          className="date-picker"
                          showIcon
                          closeOnDocumentClick
                          minDate={today}
                          selected={startDate}
                          dateFormat="yyyy-MM-dd"
                          setOpen={false}
                          onChange={(date) => {
                            setStartDate(date);
                            console.log(date);
                          }}
                          placeholderText="YYYY-MM-DD"
                        />
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                <div style={{ display: "flex", justifyContent: "column" }}>
                  <div id="addMealForm-title">Meal Type *</div>
                  <div id="addMealForm-input">
                    <select
                      required
                      value={mealType}
                      onChange={(e) => {
                        setMealType(e.target.value);
                        console.log(e.target.value);
                      }}
                      onBlur={(e) => {
                        setMealType(e.target.value);
                        console.log(e.target.value);
                      }}
                    >
                      <option disabled value="">
                        Select your option
                      </option>
                      <option value={"Breakfast"}>Breakfast</option>
                      <option value={"Lunch"}>Lunch</option>
                      <option value={"Dinner"}>Dinner</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "column" }}>
                  <div id="addMealForm-title">Food Name *</div>
                  <div id="addMealForm-input">
                    <input
                      required
                      placeholder="e.g. pizza"
                      className="profile-inputs"
                      type="text"
                      value={foodName || ""}
                      onChange={(e) => {
                        setFoodName(e.target.value);
                        // console.log(foodName);
                      }}
                      onBlur={(e) => {
                        setFoodName(e.target.value);
                        console.log(e.target.value);
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "column" }}>
                  <div id="addMealForm-title">Calories</div>
                  <div id="addMealForm-input">
                    <input
                      className="profile-inputs"
                      placeholder="e.g. 800"
                      type="number"
                      value={calories || ""}
                      onChange={(e) => {
                        setCalories(e.target.value);
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "column" }}>
                  <div id="addMealForm-title">Recipe URL</div>
                  <div
                    id="addMealForm-input"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <input
                      className="profile-inputs"
                      type="text"
                      placeholder="e.g. allrecipes.com"
                      value={recipeURL || ""}
                      onChange={(e) => {
                        setRecipeURL(e.target.value);
                      }}
                    />
                    {recipeURL !== "" ? (
                      <a
                        href={`${recipeURL}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <PreviewIcon style={{ color: "#9c9b9b" }} />
                      </a>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div>
                  <div className="smallFont">* required</div>
                </div>
                <br />
                <div className="flexCenter">
                  <button
                    onClick={() => handlePopupSubmit()}
                    className="update-button"
                  >
                    Save Meal
                  </button>
                  <button
                    onClick={() => handleDeleteEvent()}
                    className="delete-button"
                  >
                    Delete Meal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Popup>
    </div>
  );
}
