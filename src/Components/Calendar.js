import React, { useEffect, useState } from "react";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

// import Popover from "@mui/material";
// import { Typography } from "@mui/material";
// import Button from "@mui/material";

export default function Calendar() {
  // initialize popup values
  const [open, setOpen] = useState(false);
  const [openEvent, setOpenEvent] = useState(false);

  // initialize form inputs for dateClick
  const [mealType, setMealType] = useState("");
  const [calories, setCalories] = useState("");
  const [foodName, setFoodName] = useState("");
  const [recipeURL, setRecipeURL] = useState("");
  const [start, setStart] = useState("");
  //initialize form inputs for eventClick
  const [mealTypeEvent, setMealTypeEvent] = useState("");
  const [caloriesEvent, setCaloriesEvent] = useState("");
  const [foodNameEvent, setFoodNameEvent] = useState("");
  const [recipeURLEvent, setRecipeURLEvent] = useState("");

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

  // to check state for events has been added
  useEffect(() => {
    console.log(events);
    resetFields();
  }, [events]);

  // when date is clicked and meal form is saved
  const onSaveSubmit = () => {
    setOpen(false);
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
  };

  // to reset input fields after event is saved
  const resetFields = () => {
    setMealType("");
    setCalories("");
    setFoodName("");
    setRecipeURL("");
  };

  //when user clicks on date
  const dateClickHandler = (info) => {
    setOpen((o) => !o);
    console.log("Selecting Date...");
    const date = info.start;
    setStart(date);
    console.log(date);
    console.log(info);
  };

  // when user clicks on event
  const eventsHandler = (info) => {
    setOpenEvent((o) => !o);
    console.log("Selected event...");
    console.log("Events Info : ", info);
    console.log(info.event._def);
    const title = info.event._def.title;
    const extendedProps = info.event._def.extendedProps;
    console.log(title, extendedProps);
    setMealTypeEvent(title);
    setCaloriesEvent(extendedProps.calories);
    setFoodNameEvent(extendedProps.Food);
    setRecipeURLEvent(extendedProps.recipeURL);
    console.log(foodNameEvent);
  };

  // when event is edited and saved
  const onSaveSubmitEvent = (info) => {
    // info.jsEvent.preventDefault();
    console.log("Saving meal after setEvents");
    console.log(info);
    // if (info.event.url) {
    //   window.open(info.event.url);
    // }
  };

  //   //style={{ display: "flex", justifyContent: "center" }}

  return (
    <div style={{ justifyContent: "center" }}>
      <Fullcalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: "title",
          center: "dayGridMonth timeGridWeek new",
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
            click: { dateClickHandler },
          },
        }}
        select={(info) => dateClickHandler(info)}
        eventClick={(info) => eventsHandler(info)}
        eventContent={renderEventContent}
      />
      <Popup open={open} closeOnDocumentClick>
        <div className="modal">
          Fill up this form to insert a food into your meal plan.
          <br />
          <div>
            <table
              style={{
                fontSize: "0.9rem",
                margin: "auto",
              }}
            >
              <tr className="height">
                <td style={{ width: "8rem" }}>Meal Type </td>
                <td>
                  <input
                    className="profile-inputs"
                    type="text"
                    value={mealType}
                    onChange={(e) => {
                      setMealType(e.target.value);
                      console.log(mealType);
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
                      console.log(foodName);
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
            </table>{" "}
          </div>
          <br />
          <br />
          <div style={{ alignSelf: "center" }}>
            <button onClick={onSaveSubmit} className="update-button">
              Save Meal
            </button>
          </div>
        </div>
      </Popup>
      <Popup open={openEvent} closeOnDocumentClick>
        <div className="modal">
          These are your meal details.
          <br />
          <div>
            <table
              style={{
                fontSize: "0.9rem",
                margin: "auto",
              }}
            >
              <tr className="height">
                <td style={{ width: "8rem" }}>Meal Type </td>
                <td>
                  <input
                    className="profile-inputs"
                    type="text"
                    value={mealTypeEvent}
                    onChange={(e) => {
                      setMealTypeEvent(e.target.value);
                      console.log(mealTypeEvent);
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
                    value={foodNameEvent}
                    onChange={(e) => {
                      setFoodNameEvent(e.target.value);
                      console.log(foodNameEvent);
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
                    value={caloriesEvent}
                    onChange={(e) => {
                      setCaloriesEvent(e.target.value);
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
                    value={recipeURLEvent}
                    onChange={(e) => {
                      setRecipeURLEvent(e.target.value);
                    }}
                  />
                </td>
              </tr>
            </table>{" "}
          </div>
          <br />
          <br />
          <div style={{ alignSelf: "center" }}>
            <button onClick={onSaveSubmitEvent} className="update-button">
              Save Edits
            </button>
          </div>
        </div>
      </Popup>
    </div>
  );
}
