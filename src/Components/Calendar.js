import React, { useEffect, useState, useContext } from "react";
import { ref, set, get, update, onValue } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { database } from "../firebase";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import PreviewIcon from "@mui/icons-material/Preview";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";

import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { StartwoTone } from "@mui/icons-material";
// import dayjs from "dayjs";

export default function Calendar() {
  const user = useContext(UserContext);
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState(new Date());
  // const [newDate, setNewDate] = useState("");

  // setDatabase reference
  const DB_CALENDAR_KEY = "userCalendar/";
  const userRef = ref(database, DB_CALENDAR_KEY + user.uid);

  // Receive props from MealPlan.js
  const [savedMealData, setSavedMealData] = useState({});
  const [selectedMeal, setSelectedMeal] = useState(null);
  const DB_SAVEMEAL_KEY = "userSavedMeal/";

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
    setMode("newmeal");
    setStart("");
    setOpen(true);
    console.log("Adding a new meal...", mode);
  };

  // when user clicks on any dates on the calendar
  const dateClickHandler = (info) => {
    const entereddate = new Date(info.startStr);
    if (entereddate < today) {
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
    setMode("editevent");
    console.log(`info:`, info);
    console.log(`info startstr: `, info.event.startStr);
    setOpen(true);
    const event = info.event._def;
    console.log(event.publicId);
    setCurrentEventID(event.publicId);
    setEventInfo(event);
    console.log("Selected event...");
    console.log(info.event._def);
    const title = event.title;
    const date = info.event.startStr.substring(0, 10);
    const start = info.event.startStr.substring(0, 19);
    setStartStr(date);
    console.log("Date str is ", date);
    const extendedProps = event.extendedProps;
    console.log(title, extendedProps);
    setStart(start);
    setMealType(title);
    setCalories(extendedProps.calories);
    setFoodName(extendedProps.Food);
    setRecipeURL(extendedProps.recipeURL);
  };

  // to change start date from mini calendar into format for big calendar
  useEffect(() => {
    console.log(startDate);
    const year = startDate.toLocaleDateString("default", { year: "numeric" });
    const month = startDate.toLocaleDateString("default", { month: "2-digit" });
    const day = startDate.toLocaleDateString("default", { day: "2-digit" });
    const date = [year, month, day].join("-");
    console.log(date);
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

  // useEffect(() => {
  //   console.log(calories);
  // }, [calories]);

  // useEffect(() => {
  //   console.log(recipeURL);
  // }, [recipeURL]);

  // useEffect(() => {
  //   console.log(foodName);
  // }, [foodName]);

  useEffect(() => {
    console.log("start is ", start);
  }, [start]);

  // when page loads runs once to get snapshot
  useEffect(() => {
    onAuthStateChanged(auth, (currUser) => {
      console.log("Auth state is changed! ");
      if (currUser) {
        console.log("Curr User is : ", currUser);
        setCount(events.length);
        get(userRef).then((snapshot) => {
          console.log(snapshot.val());
          const snapshott = snapshot.val();
          if (snapshot.exists()) {
            setDbSnapshot(snapshott);
            console.log("Db data is being fetched, snapshot updated! ");
            if (snapshott && Array.isArray(snapshott.events)) {
              console.log("Success!!!!!");
              setEvents(snapshott.events);
              setFirstTime(false);
              console.log(events);
              return;
            }
          } else {
            console.log("User has no calendar on database!");
            setFirstTime(false);
            return;
          }
        });
      } else {
        console.log("User is not logged in!");
        navigate("/");
      }
    });
  }, []);

  useEffect(() => {
    console.log(events);
    setCount(events.length);
    if (!firstTime && mode !== "deleteevent") {
      console.log(events);
      const newEvents = events;
      get(userRef).then((snapshot) => {
        // const snapshott = snapshot.val();
        console.log(snapshot.val());
        // const snapshott = snapshot.val();
        if (snapshot.exists()) {
          console.log("User has calendar, so updating DB! ");
          update(userRef, { events: newEvents });
        } else {
          console.log("User has no calendar, so setting DB!");
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
    console.log("delete event");
    setOpen(false);
    setMode("deleteevent");
    console.log("Deleting existing event...");
    console.log(start);
    console.log("To be deleted : ", events[currentEventID]);
    const eventsCopy = [...events];
    eventsCopy.splice(currentEventID, 1);
    let counter = currentEventID;
    console.log(eventsCopy);
    while (counter < eventsCopy.length) {
      console.log("Value of id ", count, " is : ", eventsCopy[counter].id);
      eventsCopy[counter].id = counter;
      console.log("After update id : ", eventsCopy[counter].id);
      counter++;
    }
    setEvents(eventsCopy);
  };

  // to render each event in calendar
  const renderEventContent = (eventInfo) => {
    return (
      <>
        <b>{eventInfo.event.title} </b>
        <i>{eventInfo.event.extendedProps.Food}</i>
      </>
    );
  };

  //load external events

  // to handle meal type change
  // const handleMealTypeChange = () => {
  //   // console.log("b4 Start is ", this.start);
  //   console.log("b4 StartStr is ", startStr);
  //   console.log("new meal type is ", mealType);
  //   console.log("Event to b changed is ", events[currentEventID]);
  //   let start = "";
  //   // if (mode === "newmeal") {
  //   //   setStart(`${startStr}T00:00:00`);
  //   // }
  //   console.log(count);
  //   if (foodName) {
  //     console.log("Saving meal Before setEvents!");
  //     if (mealType === "Breakfast") {
  //       start = `${startStr}T06:00:00`;
  //       console.log(start);
  //       setStart(`${startStr}T06:00:00`);
  //     } else if (mealType === "Lunch") {
  //       start = `${startStr}T12:00:00`;
  //       console.log(start);
  //       setStart(`${startStr}T12:00:00`);
  //     } else if (mealType === "Dinner") {
  //       start = `${startStr}T18:00:00`;
  //       console.log(start);
  //       setStart(`${startStr}T18:00:00`);
  //     }
  //   }

  //   return start;
  // };

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
    console.log("Mode is : ", mode);
    console.log("Start is : ", recipeURL);
    console.log("Foodname is : ", foodName);
    console.log("Calories is : ", calories);
    if (mode === "editevent") {
      console.log("Selected existing event...");
      console.log(start);
      console.log("Yay! ", events[currentEventID]);
      const eventsCopy = [...events];
      console.log(start);
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
      console.log(currentEvent);
      eventsCopy[currentEventID] = currentEvent;
      console.log(eventsCopy[currentEventID]);
      console.log(eventsCopy);
      setEvents(eventsCopy);
    } else if (mode === "newdate" || mode === "newmeal") {
      if (foodName) {
        // let start = "";
        // if (mode === "newmeal") {
        //   setStart(`${startStr}T00:00:00`);
        // }
        // console.log(count);
        // if (foodName) {
        //   console.log("Saving meal Before setEvents!");
        //   console.log(events);
        //   if (mealType === "Breakfast") {
        //     start = `${startStr}T06:00:00`;
        //     console.log(start);
        //     setStart(start);
        //   } else if (mealType === "Lunch") {
        //     start = `${startStr}T12:00:00`;
        //     console.log(start);
        //     setStart(start);
        //   } else if (mealType === "Dinner") {
        //     start = `${startStr}T18:00:00`;
        //     console.log(start);
        //     setStart(start);
        console.log("Start time is : ", start);
        console.log("B4 set events, event is ", events[currentEventID]);
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
      console.log("After edit time, event is ", events[currentEventID]);
      console.log("Saving meal after setEvents");
      console.log(events);
    }
    resetFields();
  };

  //event drop
  const updateEventOnDragged = (eventInfo) => {
    console.log("I am called! ", eventInfo);
    let newStartStr = eventInfo.event.startStr;
    newStartStr = newStartStr.substring(0, 19);
    const eventID = eventInfo.event.id;
    console.log("New Event ID is : ", eventInfo.event.id);
    console.log("Dropped event");
    setMode("deleteevent");
    console.log("Updating existing event...");
    console.log("To be edited : ", events[eventID]);
    const eventsCopy = [...events];
    eventsCopy[eventID].start = newStartStr;
    eventsCopy[eventID].extendedProps.start = newStartStr;
    console.log("After update start : ", eventsCopy[eventID]);
    setEvents(eventsCopy);
    console.log(events);
  };

  // ===== BELOW SECTION IS FOR RENDERING OUT POPULATED FIELD BASED ON WHAT USER HAS ADDED FROM MEALPLAN.JS ===== //
  // update useEffect to display saved meal(s) in Calendar.js
  useEffect(() => {
    const addMealRef = ref(database, DB_SAVEMEAL_KEY + user.uid);

    onValue(addMealRef, (snapshot) => {
      const data = snapshot.val();
      console.log(`line 303 data:`, data);
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
    console.log("selected meal:", meal);
  };

  // rendering it out in calendar.js 'Add Meal' form
  const renderPopulatedFields = (
    <div>
      <h3>Pick from your saved list:</h3>
      <ul>
        {Object.values(savedMealData).map((meal, index) => {
          return (
            <li key={index} onClick={() => handleSelectMeal(meal)}>
              {meal.nameOfFood}
            </li>
          );
        })}
      </ul>
    </div>
  );
  // ===== END OF SECTION ===== //

  return (
    <div style={{ justifyContent: "center" }}>
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
        selectable={true}
        editable={true}
        events={events}
        height={"90vh"}
        //      eventBackgroundColor="#efe9e0" : to set background color. default color is blue for all day event. Only works for all day event.
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
        <div className="modal text-center">
          {mode === "newdate" ? (
            <p>
              Fill up this form to insert a food into your meal plan or choose
              from your saved list!
            </p>
          ) : mode === "editevent" ? (
            <p>
              You have set this meal earlier. <br />
              Please save the form if you have made any changes
            </p>
          ) : (
            <p>Fill up the form and save it to add a meal to your plan!</p>
          )}
          <br />

          {/* WIP J TO CONTINUE AFTER CONNIE IS DONE W CALENDAR */}
          {renderPopulatedFields}

          <br />
          <div>
            <p alignSelf="left">* required</p>
            <table
              style={{
                fontSize: "0.9rem",
                margin: "auto",
              }}
            >
              <tbody>
                {mode === "newmeal" ? (
                  <tr className="height">
                    <td style={{ width: "8rem" }}>Date of Meal *</td>
                    <td>
                      <DatePicker
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
                        onBlur={(date) => {
                          setStartDate(date);
                          console.log(date);
                        }}
                        placeholderText="YYYY-MM-DD"
                      />
                    </td>
                  </tr>
                ) : (
                  ""
                )}
                <tr className="height">
                  <td style={{ width: "8rem" }}>Meal Type *</td>
                  <td>
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
                  </td>
                </tr>

                <tr className="height">
                  <td>Food Name * </td>
                  <td>
                    <input
                      required
                      placeholder="Name of food"
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
                  </td>
                </tr>

                <tr className="height">
                  <td>Calories </td>
                  <td>
                    <input
                      className="profile-inputs"
                      placeholder="Only Numbers allowed"
                      type="number"
                      value={calories || ""}
                      onChange={(e) => {
                        setCalories(e.target.value);
                      }}
                    />
                  </td>
                </tr>

                <tr className="height">
                  <td>Recipe URL </td>
                  <td>
                    <input
                      className="profile-inputs"
                      type="text"
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
                        <PreviewIcon />
                      </a>
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <br />

          <div style={{ alignSelf: "center" }}>
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

          {/* <div style={{ alignSelf: "center" }}></div> */}
        </div>
      </Popup>
    </div>
  );
}
