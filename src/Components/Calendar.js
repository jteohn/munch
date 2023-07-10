import React, { useEffect, useState, useContext } from "react";
import { ref, set, get, update } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { database } from "../firebase";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

export default function Calendar(props) {
  const user = useContext(UserContext);
  const navigate = useNavigate();

  // setDatabase reference
  const DB_CALENDAR_KEY = "userCalendar/";
  const userRef = ref(database, DB_CALENDAR_KEY + user.uid);

  // Receive props from MealPlan.js
  const { addMeal } = props;
  const [savedMealData, setSavedMealData] = useState(addMeal);
  const [selectedMeal, setSelectedMeal] = useState(null);

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

  // to render each event in calendar
  const renderEventContent = (eventInfo) => {
    return (
      <>
        <b>{eventInfo.event.title} </b>
        <i>{eventInfo.event.extendedProps.Food}</i>
      </>
    );
  };

  // to reset input fields after event is saved
  const resetFields = () => {
    setMealType("");
    setCalories("");
    setFoodName("");
    setRecipeURL("");
    setStart("");
    setStartStr("");
    setMode("");
    setFirstTime(false);
    console.log("Fields are reset, open is : ", open);
  };

  // when user clicks on "Add Meal" button
  const chooseDateHandler = () => {
    setMode("newmeal");
    setStart("");
    setOpen(true);
    console.log("Adding a new meal...", mode);
    setSelectedMeal(addMeal);
  };

  // when user clicks on any dates on the calendar
  const dateClickHandler = (info) => {
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
    setOpen(true);
    const event = info.event._def;
    console.log(event.publicId);
    setCurrentEventID(event.publicId);
    setEventInfo(event);
    console.log("Selected event...");
    console.log(info.event._def);
    const title = event.title;
    const extendedProps = event.extendedProps;
    console.log(title, extendedProps);
    setStart(extendedProps.start);
    setMealType(title);
    setCalories(extendedProps.calories);
    setFoodName(extendedProps.Food);
    setRecipeURL(extendedProps.recipeURL);
  };

  useEffect(() => {
    console.log(mealType);
  }, [mealType]);

  useEffect(() => {
    console.log(calories);
  }, [calories]);

  useEffect(() => {
    console.log(recipeURL);
  }, [recipeURL]);

  useEffect(() => {
    console.log(foodName);
  }, [foodName]);

  // useEffect(() => {
  //   console.log(eventInfo);
  // }, [eventInfo]);

  // // to double check start time is set
  // useEffect(() => {
  //   console.log("Start is : ", start);
  // }, [start]);

  // // to double check currentEventID is set correctly
  // useEffect(() => {
  //   console.log(currentEventID);
  // }, [currentEventID]);

  // to double check currentEventID is set correctly
  // useEffect(() => {
  //   console.log("Count is updated : ", count);
  // }, [count]);

  useEffect(() => {
    console.log("Mode is ", mode);
  }, [mode]);

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
    if (!firstTime) {
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
    }
  }, [events]);

  // useEffect(() => {
  //   console.log("First time is changed to : ", firstTime);
  // }, [firstTime]);

  // to enable user to close pop ups without saving by clicking anywhere on document
  const handleClosePopupWithoutSubmit = () => {
    setOpen(false);
    resetFields();
  };

  // handle all submit buttons for pop up
  const handlePopupSubmit = () => {
    setOpen(false);
    console.log("Mode is : ", mode);
    console.log("URL is : ", recipeURL);
    console.log("Start is : ", recipeURL);
    console.log("Foodname is : ", foodName);
    console.log("Calories is : ", calories);
    if (mode === "editevent") {
      console.log("Selected existing event...");
      console.log(start);
      console.log("Yay! ", events[currentEventID]);
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
      console.log(currentEvent);
      eventsCopy[currentEventID] = currentEvent;
      console.log(eventsCopy[currentEventID]);
      console.log(eventsCopy);
      setEvents(eventsCopy);
    } else if (mode === "newdate" || mode === "newmeal") {
      let start = "";
      if (mode === "newmeal") {
        setStart(`${startStr}T00:00:00`);
      }
      console.log(count);
      console.log("NM Mode is : ", mode);
      console.log("NM URL is : ", recipeURL);
      console.log("NM Start is : ", recipeURL);
      console.log("NM Foodname is : ", foodName);
      console.log("NM Calories is : ", calories);
      if (foodName) {
        console.log("Saving meal Before setEvents!");
        console.log(events);
        if (mealType === "Breakfast") {
          start = `${startStr}T06:00:00`;
          console.log(start);
          setStart(start);
        } else if (mealType === "Lunch") {
          start = `${startStr}T12:00:00`;
          console.log(start);
          setStart(start);
        } else if (mealType === "Dinner") {
          start = `${startStr}T18:00:00`;
          console.log(start);
          setStart(start);
        }
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
      console.log("Saving meal after setEvents");
      console.log(events);
    }
    resetFields();
  };

  // ===== BELOW SECTION IS FOR RENDERING OUT POPULATED FIELD BASED ON WHAT USER HAS ADDED FROM CALORIENINJA ===== //
  // Update mealData state whenever there're changes to addMeal props.
  useEffect(() => {
    setSavedMealData(addMeal);
  }, [addMeal]);

  // Update setMealType and setCalories if user has already added their meal data using calorieNinja and they'd like to store the data in calendar.
  useEffect(() => {
    if (selectedMeal) {
      setMealType(selectedMeal.typeOfMeal);
      setFoodName(selectedMeal.nameOfFood);
      setCalories(selectedMeal.totalCalories);
    }
  }, [selectedMeal]);

  const handleSelectMeal = (meal) => {
    setSelectedMeal(meal);
    console.log("selected meal:", meal);
  };

  const renderPopulatedFields = (
    <div>
      <h3>Pick from your saved list:</h3>
      <ul>
        {addMeal.map((meal, index) => {
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
        events={events}
        height={"90vh"}
        //      eventBackgroundColor="#efe9e0" : to set background color. default color is blue for all day event. Only works for all day event.
        customButtons={{
          new: {
            text: "Add Meal",
            click: () => chooseDateHandler(),
          },
        }}
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
            <table
              style={{
                fontSize: "0.9rem",
                margin: "auto",
              }}
            >
              <tbody>
                {mode === "newmeal" ? (
                  <tr className="height">
                    <td style={{ width: "8rem" }}>Date </td>
                    <td>
                      <input
                        className="profile-inputs"
                        type="text"
                        placeholder="yyyy-mm-dd"
                        value={startStr}
                        onChange={(e) => {
                          setStartStr(e.target.value);
                          console.log(startStr);
                        }}
                      />
                    </td>
                  </tr>
                ) : (
                  ""
                )}
                <tr className="height">
                  <td style={{ width: "8rem" }}>Meal Type </td>
                  <td>
                    <select
                      value={mealType}
                      onChange={(e) => {
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
                    {/* <input
                      className="profile-inputs"
                      type="text"
                      value={mealType}
                      onChange={(e) => {
                        setMealType(e.target.value);
                        // console.log(mealType);
                      }}
                    /> */}
                  </td>
                </tr>

                <tr className="height">
                  <td>Food Name </td>
                  <td>
                    <input
                      className="profile-inputs"
                      type="text"
                      value={foodName || ""}
                      onChange={(e) => {
                        setFoodName(e.target.value);
                        // console.log(foodName);
                      }}
                    />
                  </td>
                </tr>

                <tr className="height">
                  <td>Calories </td>
                  <td>
                    <input
                      className="profile-inputs"
                      type="text"
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
                      value={recipeURL}
                      onChange={(e) => {
                        setRecipeURL(e.target.value);
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <br />
          <br />
          <div style={{ alignSelf: "center" }}>
            <button
              onClick={() => handlePopupSubmit()}
              className="update-button"
            >
              Save Meal
            </button>
          </div>
        </div>
      </Popup>
    </div>
  );
}
