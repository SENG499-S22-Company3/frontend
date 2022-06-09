import React, { useState } from "react";
import { Scheduler, Editing } from "devextreme-react/scheduler";
import { AppointmentCard } from "./AppointmentCard";
import { Appointment, Course, ScheduleAssignment } from "../../stores/schedule";
import "devextreme/dist/css/dx.dark.css";

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
const splitCourseDays = (course: Course) => {
  const { monday, tuesday, wednesday, thursday, friday, beginTime, endTime } =
    course.meetingTime;
  const daysArray = [monday, tuesday, wednesday, thursday, friday];

  //2022-05-31T is a monday, and we just need the base to be a monday
  //HH:MM:SS.000-7:00 for time format, it comes in HHMM format.
  const beginHoursMinutes = [
    beginTime.slice(0, beginTime.length / 2),
    beginTime.slice(-beginTime.length / 2),
  ];
  const endHourMinutes = [
    endTime.slice(0, endTime.length / 2),
    endTime.slice(-endTime.length / 2),
  ];

  const begin =
    "2022-05-31T" +
    beginHoursMinutes[0] +
    ":" +
    beginHoursMinutes[1] +
    ":00.000-07:00";
  const end =
    "2022-05-31T" +
    endHourMinutes[0] +
    ":" +
    endHourMinutes[1] +
    ":00.000-07:00";

  const splitAppointments = daysArray.map((day, index) => {
    if (!day) {
      return null;
    }

    const startDate = new Date(begin);
    const endDate = new Date(end);

    //change the date based on what day of the week it's supposed to be
    startDate.setDate(startDate.getDate() + index - 1);
    endDate.setDate(endDate.getDate() + index - 1);

    const { meetingTime, ...appointment } = {
      ...course,
      startDate: startDate,
      endDate: endDate,
    };
    return appointment;
  });
  const validAppointments = splitAppointments.filter(
    (appointment) => appointment !== null
  ) as Appointment[];
  return validAppointments;
};

//convert Course object data from backend to the structure DevExtreme expects
const buildAppointments = (courses: Course[]) => {
  const appointments = courses
    .flatMap((course) => {
      const assignedCourses = splitCourseDays(course);
      return assignedCourses;
    });
  return appointments;
};

interface CalendarProps {
  data: ScheduleAssignment;
}

export const CalendarView = (props: CalendarProps) => {
  const { data } = props;

  const [currentDate, setCurrentDate] = useState(new Date("2022-05-31"));
  const [viewState, setViewState] = useState("workWeek");
  const weekDay = getWeekDay(currentDate);

  //for now just mock one semesters data
  const fallTermData = data.fallTermCourses;
  const appointments = buildAppointments(fallTermData);

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
        appointmentRender={AppointmentCard}
        customizeDateNavigatorText={(info) => getWeekDay(info.startDate)}
        dateCellTemplate={dateCell}
        timeZone="America/Vancouver"
        currentDate={currentDate}
        views={["day", "workWeek"]}
        defaultCurrentView={viewState}
        showAllDayPanel={false}
        startDayHour={8}
        endDayHour={22}
        textExpr="courseTitle"
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
