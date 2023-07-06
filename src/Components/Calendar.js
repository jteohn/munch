import React from "react";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
// import Popover from "@mui/material";
// import { Typography } from "@mui/material";
// import Button from "@mui/material";

export default function ShowCalendar() {
  // events
  const events = [
    {
      id: 1,
      title: "Lunch",
      start: "2023-07-14",
      allDay: true,
      description: "Chicken lasagne",
    },
    {
      id: 2,
      title: "Beef",
      start: "2023-07-16T13:00:00",
      end: "2023-07-16T18:00:00",
    },
    {
      id: 3,
      title: "event 3",
      start: "2021-06-17",
      end: "2021-06-20",
    },
  ];

  const eventRender = (info) => {
    const element = info.el;
    const event = info.event;

    element.qtip({
      content: event.extendedProps.description,
    });
  };

  const dateClickHandler = () => {
    console.log("Selecting...");
  };

  const eventsHandler = () => {
    console.log("Selected event...");
  };

  //style={{ display: "flex", justifyContent: "center" }}

  return (
    <div style={{ justifyContent: "center" }}>
      <Fullcalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: "title",
          center: "dayGridMonth, timeGridWeek, timeGridDay new",
          end: "today prev, next",
        }}
        nowIndicator={true}
        selectable={true}
        events={events}
        height={"90vh"}
        customButtons={{
          new: {
            text: "Add Meal",
            click: function () {
              alert("Clicked add Meal!");
            },
          },
        }}
        dateClick={(e) => dateClickHandler(e)}
        eventClick={(e) => eventsHandler(e)}
        eventRender={eventRender}
      />
    </div>
  );
}
