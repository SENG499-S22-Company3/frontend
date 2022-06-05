import React, { useState } from "react";
import { Scheduler, Editing } from "devextreme-react/scheduler";
import { Appointment } from "./Appointment";
import { Assignment } from "../../stores/schedule";
import "devextreme/dist/css/dx.dark.css";

//dummy data
var assignments: Assignment[] = [
  {
    course: "SENG 265",
    startDate: new Date("2022-06-03T16:00:00.000Z"), //for now this isn't used for anything
    endDate: new Date("2022-06-03T16:50:00.000Z"),
    beginTime: "16:00:00.000Z", //this isn't the time format we are gonna use, but for now its the best for mock data
    endTime: "16:50:00.000Z",
    professor: "Mike Zastre",
    tuesday: true,
    wednesday: true,
    friday: true,
  },
  {
    course: "CSC 320",
    startDate: new Date("2022-06-03T19:00:00.000Z"),
    endDate: new Date("2022-06-03T21:20:00.000Z"),
    beginTime: "19:00:00.000Z",
    endTime: "21:20:00.000Z",
    professor: "Valerie King",
    friday: true,
  },
  {
    course: "CSC 360",
    startDate: new Date("2022-05-30T16:00:00.000Z"),
    endDate: new Date("2022-05-30T17:20:00.000Z"),
    beginTime: "16:00:00.000Z",
    endTime: "17:20:00.000Z",
    professor: "David Corless",
    monday: true,
    thursday: true,
  },
  {
    course: "ECE 260",
    startDate: new Date("2022-05-31T21:00:00.000Z"),
    endDate: new Date("2022-05-31T21:50:00.000Z"),
    beginTime: "21:00:00.000Z",
    endTime: "21:50:00.000Z",
    professor: "Michael Adams",
    tuesday: true,
    wednesday: true,
    friday: true,
  },
  {
    course: "SENG 350",
    startDate: new Date("2022-05-30T17:30:00.000Z"),
    endDate: new Date("2022-05-30T18:50:00.000Z"),
    beginTime: "17:30:00.000Z",
    endTime: "18:50:00.000Z",
    professor: "Jens Weber",
    monday: true,
    thursday: true,
  },
];

//make column headers only the weekday
const dateCell = ({ text }: { text: String }) => {
  const dayOfWeek = text.split(" ")[0];
  return dayOfWeek;
};

//convert date object to week day string
const getWeekDay = (day: Date) => {
  const dayOfWeek = day.toLocaleString("default", { weekday: "long" });
  return dayOfWeek;
};

//course assignments that are flagged to be on multiple days should be set for those days
const splitCourseDays = (assignment: Assignment) => {
  const { monday, tuesday, wednesday, thursday, friday } = assignment;
  const daysArray = [monday, tuesday, wednesday, thursday, friday];

  let splitAppointments: Assignment[] = [];
  daysArray.forEach((day, index) => {
    if (!day) return;

    //2022-05-31T is a monday, and we just need the base to be a monday
    const begin = "2022-05-31T" + assignment.beginTime;
    const end = "2022-05-31T" + assignment.endTime;
    const startDate = new Date(begin);
    const endDate = new Date(end);

    //change the date based on what day of the week it's supposed to be
    startDate.setDate(startDate.getDate() + index - 1);
    endDate.setDate(endDate.getDate() + index - 1);

    const appointment = {
      ...assignment,
      startDate: startDate,
      endDate: endDate,
    };
    splitAppointments.push(appointment);
  });
  return splitAppointments;
};

export const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date("2022-05-31"));
  const [viewState, setViewState] = useState("workWeek");
  const weekDay = getWeekDay(currentDate);

  const appointments = assignments
    .map((assignment) => splitCourseDays(assignment))
    .flat();

  //custom stylings to override the DevExtreme stylings
  const css = `
    .dx-scheduler-navigator-previous {  
      visibility: ${
        viewState === "workWeek" || weekDay === "Monday" ? "hidden" : "visible"
      }
    }  
    .dx-scheduler-navigator-next {  
      visibility: ${
        viewState === "workWeek" || weekDay === "Friday" ? "hidden" : "visible"
      } 
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
        dataSource={appointments}
        appointmentRender={Appointment}
        customizeDateNavigatorText={(info) => getWeekDay(info.startDate)}
        dateCellTemplate={dateCell}
        timeZone="America/Los_Angeles"
        currentDate={currentDate}
        views={["day", "workWeek"]}
        defaultCurrentView={viewState}
        showAllDayPanel={false}
        startDayHour={8}
        endDayHour={22}
        textExpr="course"
        onCurrentViewChange={setViewState}
        onCurrentDateChange={setCurrentDate}
        onCellClick={(cell) => setCurrentDate(cell.cellData.startDate)}
      >
        <Editing
          allowAdding={false}
          allowDragging={false}
          allowDeleting={false}
          allowResizing={false}
          allowUpdating={false}
        />
      </Scheduler>
    </>
  );
};
