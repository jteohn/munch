import React, { useEffect, useState } from "react";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
// import { useMediaQuery } from "@mui/material";

export default function Calendar(props) {
  // Receive props from MealPlan.js
  const { addMeal } = props;
  const [savedMealData, setSavedMealData] = useState(addMeal);
  const [selectedMeal, setSelectedMeal] = useState(null);

  // initialize popup values
  const [open, setOpen] = useState(false);
  const [openEvent, setOpenEvent] = useState(false);

  // initialize form inputs for dateClick
  const [mealType, setMealType] = useState("");
  const [calories, setCalories] = useState("");
  const [foodName, setFoodName] = useState("");
  const [recipeURL, setRecipeURL] = useState("");
  const [start, setStart] = useState("");
  const [eventInfo, setEventInfo] = useState({});
  const [mode, setMode] = useState("");

  // initialize form inputs for eventClick
  const [mealTypeEvent, setMealTypeEvent] = useState("");
  const [caloriesEvent, setCaloriesEvent] = useState("");
  const [foodNameEvent, setFoodNameEvent] = useState("");
  const [recipeURLEvent, setRecipeURLEvent] = useState("");
  const [popupInfo, setPopupInfo] = useState("");

  const [events, setEvents] = useState([
    {
      start: "2023-07-14T12:00:00",
      title: "Breakfast ",
      extendedProps: {
        Food: " Chicken lasagne",
        recipeURL: "www.chickenlasagne.com",
        calories: "3000",
      },
    },
  ]);

  // to render each event in calendar
  const renderEventContent = (eventInfo) => {
    return (
      <>
        <b>{eventInfo.event.title} </b>
        <i>{eventInfo.event.extendedProps.Food}</i>
      </>
    );
  };

  // to check state for events has been added, ensure event added
  useEffect(() => {
    console.log(events);
  }, [events]);

  // when date is clicked and meal form is saved
  // const onSaveSubmit = () => {
  //   setOpen(false);
  //   if (mealType && foodName) {
  //     console.log("Saving meal Before setEvents!");
  //     console.log(events);
  //     setEvents((prevEvents) => [
  //       ...prevEvents,
  //       {
  //         start,
  //         title: mealType,
  //         extendedProps: {
  //           Food: foodName,
  //           recipeURL: recipeURL,
  //           calories: calories,
  //         },
  //       },
  //     ]);
  //   }
  //   console.log("Saving meal after setEvents");
  //   console.log(events);
  // };

  // to reset input fields after Add Meal Form is saved
  const resetFields = () => {
    setMealType("");
    setCalories("");
    setFoodName("");
    setRecipeURL("");
    setMode("");
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
    setOpen(true);
    console.log("Selecting Date...");
    const date = info.start;
    setMode("newdate");
    setStart(date);
    console.log("User selected date:", date);
    // console.log("All info is:", info);
  };

  // when user clicks on event
  const eventsHandler = (info) => {
    setMode("editevent");
    setOpen(true);
    const event = info.event._def;
    setEventInfo(event);
    console.log("Selected event...");
    console.log("Events Info : ", eventInfo);
    console.log(info.event._def);
    const title = info.event._def.title;
    const extendedProps = info.event._def.extendedProps;
    console.log(title, extendedProps);
    setMealType(title);
    setCalories(extendedProps.calories);
    setFoodName(extendedProps.Food);
    setRecipeURL(extendedProps.recipeURL);
    console.log(foodNameEvent);
  };

  // when user did not save/submit the Add Meal Form
  const handleClosePopupWithoutSubmit = () => {
    setOpen(false);
    resetFields();
  };

  // when event is edited and saved
  // const onSaveSubmitEvent = (info) => {
  //   // info.jsEvent.preventDefault();
  //   console.log("Saving meal after setEvents");
  //   console.log(info);
  //   // if (info.event.url) {
  //   //   window.open(info.event.url);
  //   // }
  // };

  // handle all submit buttons for pop up
  const handlePopupSubmit = () => {
    console.log("Popup submitted: ", popupInfo);
    setOpen(false);
    if (mode === "editevent") {
      console.log("Selected existing event...");
      // console.log("Events Info : ", eventInfo);
      // const title = eventInfo.title;
      // const extendedProps = eventInfo.extendedProps;
      // console.log(title, extendedProps);
      // setMealType(title);
      // setCalories(extendedProps.calories);
      // setFoodName(extendedProps.Food);
      // setRecipeURL(extendedProps.recipeURL);
      console.log(foodNameEvent);
    } else if (mode === "newdate" || mode === "newmeal") {
      if (mealType && foodName) {
        console.log("Saving meal Before setEvents!");
        console.log(events);
        setEvents((prevEvents) => [
          ...prevEvents,
          {
            start,
            title: mealType,
            extendedProps: {
              Food: foodName,
              recipeURL: recipeURL,
              calories: calories,
            },
          },
        ]);
      }
      console.log("Saving meal after setEvents");
      console.log(events);
      resetFields();
    }
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
    console.log("selected Meal:", meal);
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

  // const isMobileScreen = useMediaQuery("(max-width: 700px)");
  // const mobileView = (
  //   <div>
  //     <Fullcalendar
  //       plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
  //       initialView="listWeek"
  //       headerToolbar={{
  //         start: "",
  //         center: "title",
  //         end: "today new",
  //       }}
  //       footerToolbar={{
  //         start: "dayGridMonth timeGridWeek",
  //         end: "prev next",
  //       }}
  //       nowIndicator={true}
  //       selectable={true}
  //       events={events}
  //       height={"90vh"}
  //       //      eventBackgroundColor="#efe9e0" : to set background color. default color is blue for all day event. Only works for all day event.
  //       customButtons={{
  //         new: {
  //           text: "Add Meal",
  //           click: () => chooseDateHandler(),
  //         },
  //       }}
  //       select={(info) => dateClickHandler(info)}
  //       eventClick={(info) => eventsHandler(info)}
  //       eventContent={renderEventContent}
  //     />
  //   </div>
  // );
  //   //style={{ display: "flex", justifyContent: "center" }}

  return (
    <div
      style={{
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div>
        <Fullcalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            start: "",
            center: "title",
            end: "today new",
          }}
          footerToolbar={{
            start: "dayGridMonth timeGridWeek",
            end: "prev next",
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
      </div>

      {/* dynamic popup for date click / current event click / add meal button click */}
      <Popup
        open={open}
        closeOnDocumentClick
        onClose={handleClosePopupWithoutSubmit}
      >
        <div className="modal">
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

          {/* JAELYN EDITED */}
          {renderPopulatedFields}
          {/* <div>
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
          </div> */}

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
                        value={start}
                        onChange={(e) => {
                          setStart(e.target.value);
                          // console.log(start);
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
                    <input
                      className="profile-inputs"
                      type="text"
                      value={mealType}
                      onChange={(e) => {
                        setMealType(e.target.value);
                        // console.log(mealType);
                      }}
                    />
                  </td>
                </tr>

                <tr className="height">
                  <td>Food Name </td>
                  <td>
                    <input
                      className="profile-inputs"
                      type="text"
                      value={foodName}
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
                      value={calories}
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

// console.log(`addMeal props:`, savedMealData);

// Update setMealType and setCalories if user has already added their meal data using calorieNinja and they'd like to store the data in calendar.
// useEffect(() => {
//   if (savedMealData.length > 0) {
//     const populateMeal = savedMealData[savedMealData.length - 1];
//     setMealType(populateMeal.nameOfFood);
//     setCalories(populateMeal.totalCalories);
//   }
// }, [savedMealData]);
