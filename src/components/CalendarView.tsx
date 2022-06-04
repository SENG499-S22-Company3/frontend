import React, { useState } from "react";
import { Scheduler, View } from "devextreme-react/scheduler";
import "devextreme/dist/css/dx.dark.css";

var appointment = [
  {
    title: "SENG 265",
    startDate: new Date("2022-06-03T16:00:00.000Z"),
    endDate: new Date("2022-06-03T16:50:00.000Z"),
  },
  {
    text: "CSC 320",
    startDate: new Date("2022-06-03T20:00:00.000Z"),
    endDate: new Date("2022-06-03T21:20:00.000Z"),
  },
  {
    text: "CSC 360",
    startDate: new Date("2022-05-30T16:00:00.000Z"),
    endDate: new Date("2022-05-30T17:20:00.000Z"),
  },
  {
    text: "ECE 260",
    startDate: new Date("2022-05-31T21:00:00.000Z"),
    endDate: new Date("2022-05-31T21:50:00.000Z"),
  },
  {
    text: "SENG 350",
    startDate: new Date("2022-05-30T17:30:00.000Z"),
    endDate: new Date("2022-05-30T18:50:00.000Z"),
  },
];

export const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2021, 4, 25));
  return (
    //the library's TypeScript configuration is broken, not allowing Scheduler to have children
    //@ts-ignore
    <Scheduler
      timeZone="America/Los_Angeles"
      dataSource={appointment}
      views={["day", "week"]}
      defaultCurrentView="week"
      startDayHour={8}
    ></Scheduler>
  );
};
