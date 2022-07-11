import React, { createRef, useState } from "react";
import {
  Scheduler,
  Editing,
  AppointmentDragging,
} from "devextreme-react/scheduler";
import { AppointmentCard } from "./AppointmentCard";
import { Appointment, CourseSection } from "../../stores/schedule";
import "devextreme/dist/css/dx.dark.css";
import { weekdayToInt } from "../../utils/weekdayConversion";
import { AppointmentTooltip } from "./AppointmentTooltip";
import { getScheduleTime } from "../../utils/formatDate";
import { ModalItem } from "./AppointmentModal";

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

    const startDate = getScheduleTime(startTime);
    const endDate = getScheduleTime(endTime);

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
    // const professors = course.professors.map((prof) => prof.displayName);
    const professors = ["Joe Biden"];

    const assignedCourses = splitCourseDays(course).map((meetingTime) => {
      return {
        id: course.id,
        title: course.CourseID.code, //not in schema yet
        code: course.CourseID.code,
        subject: course.CourseID.subject,
        term: course.CourseID.term,
        sectionNumber: course.sectionNumber,
        professors: professors,
        capacity: course.capacity,
        startTime: meetingTime.startDate,
        endTime: meetingTime.endDate,
      } as Appointment;
    });

    return assignedCourses;
  });
  return appointments;
};

interface CalendarProps {
  data: CourseSection[];
  onUpdateSubmit: (updatedCourse: ModalItem) => void;
  onDragSubmit: (updatedCourse: Appointment, oldDate: Date) => void;
  refreshSchedule: () => void;
}

export const CalendarView = (props: CalendarProps) => {
  const { data, onUpdateSubmit, onDragSubmit, refreshSchedule } = props;
  const scheduleRef = createRef<Scheduler>();

  const [currentDate, setCurrentDate] = useState(new Date("2022-05-31"));
  const [viewState, setViewState] = useState("workWeek");
  const dragStartDate = new Set<Date>();

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

  const handleDragStart = (appointment: Appointment) => {
    dragStartDate.add(appointment.startTime);
  };

  const handleDragEnd = async (updatedCourse: Appointment) => {
    const oldDate = await dragStartDate.values().next().value;
    onDragSubmit(updatedCourse, oldDate);
    dragStartDate.clear();
  };

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
          <AppointmentTooltip
            model={model}
            scheduleRef={scheduleRef}
            onUpdateSubmit={onUpdateSubmit}
          />
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
        onCurrentViewChange={(value) => {
          setViewState(value);
          refreshSchedule();
        }}
        onCurrentDateChange={setCurrentDate}
        onAppointmentDblClick={(e) => (e.cancel = true)}
        startDateExpr={"startTime"}
        endDateExpr={"endTime"}
      >
        <Editing
          allowAdding={false}
          allowDeleting={false}
          allowResizing={false}
        />
        <AppointmentDragging
          onDragStart={(e: any) => handleDragStart(e.itemData)}
          onDragEnd={(e: any) => handleDragEnd(e.itemData)}
        />
      </Scheduler>
    </>
  );
};
