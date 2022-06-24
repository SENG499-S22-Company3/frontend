import React, { createRef, useState } from "react";
import { Scheduler, Editing } from "devextreme-react/scheduler";
import { AppointmentCard } from "./AppointmentCard";
import { Appointment, CourseSection } from "../../stores/schedule";
import "devextreme/dist/css/dx.dark.css";
import { weekdayToInt } from "../../utils/weekdayToInt";
import { AppointmentTooltip } from "./AppointmentTooltip";

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
const splitCourseDays = (course: CourseSection) => {
  const splitDays = course.meetingTimes.map((meetingTime) => {
    const { startTime, endTime, day } = meetingTime;

    //2022-05-31T is a monday, and we just need the base to be a monday
    //HH:MM:SS.000-7:00 for time format, it comes in HHMM format.
    const beginHoursMinutes = [
      startTime.slice(0, startTime.length / 2),
      startTime.slice(-startTime.length / 2),
    ];
    const endHourMinutes = [
      endTime.slice(0, endTime.length / 2),
      endTime.slice(-endTime.length / 2),
    ];

    const start =
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

    const startDate = new Date(start);
    const endDate = new Date(end);

    //change the date based on what day of the week it's supposed to be
    const dayShift = weekdayToInt(day);
    startDate.setDate(startDate.getDate() + dayShift - 1);
    endDate.setDate(endDate.getDate() + dayShift - 1);

    const meetingDays = {
      startDate: startDate,
      endDate: endDate,
    };

    return meetingDays;
  });

  return splitDays;
};

//convert Course object data from backend to the structure DevExtreme expects
const buildAppointments = (courses: CourseSection[]) => {
  const appointments = courses.flatMap((course) => {
    const professors = course.professors.map((prof) => prof.username); //TO-DO switch to displayName, when its in schema

    const assignedCourses = splitCourseDays(course).map((meetingTime) => {
      return {
        courseTitle: course.CourseID.code, //not in schema yet
        courseNumber: course.CourseID.code,
        subject: course.CourseID.subject,
        section: "TEMP_SECTION", //not in schema yet
        prof: professors,
        classSize: course.capacity,
        startDate: meetingTime.startDate,
        endDate: meetingTime.endDate,
      } as Appointment;
    });

    return assignedCourses;
  });
  return appointments;
};

interface CalendarProps {
  data: CourseSection[];
}

export const CalendarView = (props: CalendarProps) => {
  const { data } = props;
  const scheduleRef = createRef<Scheduler>();

  const [currentDate, setCurrentDate] = useState(new Date("2022-05-31"));
  const [viewState, setViewState] = useState("workWeek");

  const weekDay = getWeekDay(currentDate);

  //for now just mock one semesters data
  const appointments = buildAppointments(data);

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
        ref={scheduleRef}
        dataSource={appointments}
        appointmentRender={AppointmentCard}
        appointmentTooltipRender={(model) => (
          <AppointmentTooltip model={model} scheduleRef={scheduleRef} />
        )}
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
