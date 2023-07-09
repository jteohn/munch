import React, { useEffect, useState, useContext } from "react";
import { ref, set, get, onValue, update, child } from "firebase/database";
import { auth } from "../firebase";
import { database } from "../firebase";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

export default function Calendar() {
  const user = useContext(UserContext);
  const navigate = useNavigate();

  // setDatabase reference
  const DB_CALENDAR_KEY = "userCalendar/";

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
  const [dbSnapshot, setDbSnapshot] = useState([{}]);
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
    console.log("Fields are reset, open is : ", open);
  };

  //when user clicks on add a meal
  const chooseDateHandler = () => {
    setMode("newmeal");
    setStart("");
    setOpen(true);
    console.log("Adding a new meal... : ", mode);
  };

  //when user clicks on date
  const dateClickHandler = (info) => {
    setOpen(true);
    console.log("Selecting Date...");
    let date = info.start;
    const dateStr = info.startStr;
    date = `${dateStr}T00:00:00`;
    setStartStr(dateStr);
    setMode("newdate");
    setStart(date);
    console.log("Date ", date);
    console.log("All info is : ", info);
  };

  // when user clicks on event
  const eventsHandler = (info) => {
    setMode("editevent");
    console.log(info);
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
    console.log(eventInfo);
  }, [eventInfo]);

  // to double check start time is set
  useEffect(() => {
    console.log("Start is : ", start);
  }, [start]);

  // to double check currentEventID is set correctly
  useEffect(() => {
    console.log(currentEventID);
  }, [currentEventID]);

  // to double check currentEventID is set correctly
  // useEffect(() => {
  //   console.log("Count is updated : ", count);
  // }, [count]);

  // // when page loads runs once to get snapshot
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const currUser = auth.currentUser;
  //     if (currUser) {
  //       console.log("Curr User is : ", currUser);
  //       const userRef = ref(database, DB_CALENDAR_KEY + currUser.uid);
  //       const snapshot = await get(userRef);
  //       console.log(snapshot);
  //       setDbSnapshot(snapshot);
  //       const userData = snapshot.val();
  //       console.log("Data is being fetched! ");
  //       if (userData && Array.isArray(userData.events)) {
  //         console.log(userData.events);
  //         setEvents(userData.events);
  //         setFirstTime(false);
  //         console.log(events);
  //       } else {
  //         console.log("User has no calendar on database!");
  //       }
  //     } else {
  //       console.log("User is not logged in!");
  //       navigate("/");
  //     }
  //   };

  //   fetchData();
  // }, []);

  // // to check state for events has been added, ensure event added, save to database when edited
  // useEffect(() => {
  //   console.log(events);
  //   setCount(events.length);
  //   console.log("In use effects Events updated");
  //   const userCalendarRef = ref(database, DB_CALENDAR_KEY + user.uid);
  //   console.log(userCalendarRef);
  //   if (dbSnapshot && !firstTime) {
  //     update(userCalendarRef, {
  //       events: events,
  //     });
  //   } else if (!firstTime) {
  //     set(userCalendarRef, {
  //       events: events,
  //     });
  //   }

  //   // saveCalendar();
  // }, [events]);

  // const userCalendarRef = ref(database, DB_CALENDAR_KEY + user.uid);
  // onValue(userCalendarRef, async (snapshot) => {
  //   const snapshott = snapshot.val();
  //   console.log(snapshott);
  //   if (snapshott) {
  //     setDbSnapshot(snapshott);
  //   } else {
  //     console.log("Db not updated!");
  //   }
  // });

  // ===== UPDATE CODE TO PUSH EVENTS TO DATABASE ===== //
  const writeData = (events) => {
    const userRef = ref(database, DB_CALENDAR_KEY + user.uid);

    const newEvent = {
      eventFood: foodName,
      eventCalories: calories,
    };

    // add the thingy below because when user clicks "Add Meal" the dates do not have hyphens, however, when the user adds a meal from the calendar itself it is hyphenated!
    const formattedDate = startStr.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
    const dateRef = child(userRef, formattedDate);
    const mealTypeRef = child(dateRef, mealType);

    set(mealTypeRef, newEvent)
      .then(() => {
        console.log(`event added to database`);
      })
      .catch((error) => {
        console.log("Error, unable to add event to database");
      });
  };

  // to enable user to close pop ups without saving by clicking anywhere on document
  const handleClosePopupWithoutSubmit = () => {
    setOpen(false);
    resetFields();
  };

  // handle all submit buttons for pop up
  const handlePopupSubmit = () => {
    setOpen(false);
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
      if (mealType && foodName) {
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
      writeData(events);
      console.log("Saving meal after setEvents");
      console.log(events);
    }
    resetFields();
  };

  //   //style={{ display: "flex", justifyContent: "center" }}

  return (
    <div style={{ justifyContent: "center" }}>
      <Fullcalendar
        // id="calender"
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: "title",
          center: "dayGridMonth dayGridWeek new",
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
            <p>Fill up this form to insert a food into your meal plan.</p>
          ) : mode === "editevent" ? (
            <p>
              You have set this meal earlier. <br />
              Please save the form if you have made any changes
            </p>
          ) : (
            <p>Fill up the form and save it to add a meal to your plan!</p>
          )}
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
                          // console.log(startStr);
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
