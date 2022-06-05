import React from "react";
import { formatDate } from "devextreme/localization";

interface appointmentModel {
    appointmentData: courseModel;
    targetedAppointmentData: courseModel;
}

interface courseModel {
  course: string;
  professor: string;
  startDate: Date;
  endDate: Date;
}

export const Appointment = (model: appointmentModel) => {
  const courseData: courseModel = model.appointmentData;
  return (
    <div>
      <div>{courseData.course}</div>
      <div>
        <strong>{courseData.professor}</strong>
      </div>
      <div>
        {formatDate(courseData.startDate, "shortTime")}
        {" - "}
        {formatDate(courseData.endDate, "shortTime")}
      </div>
    </div>
  );
};
