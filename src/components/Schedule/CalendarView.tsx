import React, { useState } from "react";
import { Scheduler, Editing } from "devextreme-react/scheduler";
import "devextreme/dist/css/dx.dark.css";
import { Appointment } from "./Appointment";

var appointment = [
  {
    course: "SENG 265",
    startDate: new Date("2022-06-03T16:00:00.000Z"),
    endDate: new Date("2022-06-03T16:50:00.000Z"),
    professor: "Mike Zastre"
  },
  {
    course: "CSC 320",
    startDate: new Date("2022-06-03T20:00:00.000Z"),
    endDate: new Date("2022-06-03T21:20:00.000Z"),
    professor: "Valerie King"
  },
  {
    course: "CSC 360",
    startDate: new Date("2022-05-30T16:00:00.000Z"),
    endDate: new Date("2022-05-30T17:20:00.000Z"),
    professor: "David Corless"
  },
  {
    course: "ECE 260",
    startDate: new Date("2022-05-31T21:00:00.000Z"),
    endDate: new Date("2022-05-31T21:50:00.000Z"),
    professor: "Michael Adams"
  },
  {
    course: "SENG 350",
    startDate: new Date("2022-05-30T17:30:00.000Z"),
    endDate: new Date("2022-05-30T18:50:00.000Z"),
    professor: "Jens Weber"
  },
];

export const CalendarView = () => {
  //todo: on click of day, set current day
  const [currentDate, setCurrentDate] = useState(new Date());
  return (
    //the library's TypeScript configuration is broken, not allowing Scheduler to have children
    //@ts-ignore
    <Scheduler
      appointmentRender={Appointment}
      timeZone="America/Los_Angeles"
      currentDate={currentDate}
      dataSource={appointment}
      views={["day", "workWeek"]}
      defaultCurrentView="workWeek"
      showAllDayPanel={false}
      startDayHour={8}
      endDayHour={22}
      textExpr="course"
    >
      <Editing allowAdding={false} />
    </Scheduler>
  );
};
