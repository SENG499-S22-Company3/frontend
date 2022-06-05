import React, { useState } from "react";
import { Scheduler, Editing } from "devextreme-react/scheduler";
import "devextreme/dist/css/dx.dark.css";
import { Appointment } from "./Appointment";

var appointment = [
  {
    course: "SENG 265",
    startDate: new Date("2022-06-03T16:00:00.000Z"),
    endDate: new Date("2022-06-03T16:50:00.000Z"),
    professor: "Mike Zastre",
    days: ["T", "W", "F"],
  },
  {
    course: "CSC 320",
    startDate: new Date("2022-06-03T20:00:00.000Z"),
    endDate: new Date("2022-06-03T21:20:00.000Z"),
    professor: "Valerie King",
  },
  {
    course: "CSC 360",
    startDate: new Date("2022-05-30T16:00:00.000Z"),
    endDate: new Date("2022-05-30T17:20:00.000Z"),
    professor: "David Corless",
  },
  {
    course: "ECE 260",
    startDate: new Date("2022-05-31T21:00:00.000Z"),
    endDate: new Date("2022-05-31T21:50:00.000Z"),
    professor: "Michael Adams",
  },
  {
    course: "SENG 350",
    startDate: new Date("2022-05-30T17:30:00.000Z"),
    endDate: new Date("2022-05-30T18:50:00.000Z"),
    professor: "Jens Weber",
  },
];

//make column headers only the weekday
const dateCell = ({ text }: { text: String }) => {
  const dayOfWeek = text.split(" ")[0];
  return dayOfWeek;
};

//make day navigator only the weekday
const getWeekDay = (day: Date) => {
  const dayOfWeek = day.toLocaleString("default", { weekday: "long" });
  console.log(dayOfWeek)
  return dayOfWeek;
};

export const CalendarView = () => {
  //todo: on click of day, set current day
  const [currentDate, setCurrentDate] = useState(new Date("2022-05-31"));
  const [viewState, setViewState] = useState("workWeek");
  const [selectedDay, setSelectedDay] = useState("Monday");

  //custom stylings to override the DevExtreme stylings
  const css = `
    .dx-scheduler-navigator-previous {  
      visibility: ${viewState === "workWeek" || selectedDay === "Monday" ? "hidden" : "visible"}
    }  
    .dx-scheduler-navigator-next {  
      visibility: ${viewState === "workWeek" || selectedDay === "Friday" ? "hidden" : "visible"} 
    }  
    .dx-scheduler-navigator {
      visibility: ${viewState === "workWeek" ? "hidden" : "visible"}
     }
  `;

  return (
    <>
      <style>{css}</style>
      {/* the library's TypeScript configuration is broken, not allowing Scheduler to have children */}
      {/*@ts-ignore*/}
      <Scheduler
        appointmentRender={Appointment}
        customizeDateNavigatorText={(info) => getWeekDay(info.startDate)}
        dateCellTemplate={dateCell}
        timeZone="America/Los_Angeles"
        currentDate={currentDate}
        dataSource={appointment}
        views={["day", "workWeek"]}
        defaultCurrentView={viewState}
        showAllDayPanel={false}
        startDayHour={8}
        endDayHour={22}
        textExpr="course"
        onCurrentViewChange={setViewState}
        onCurrentDateChange={(newDay) => setSelectedDay(getWeekDay(newDay))}
      >
        <Editing allowAdding={false} allowDragging={false} allowDeleting={false} allowResizing={false} />
      </Scheduler>
    </>
  );
};
