import React from "react";
import { formatDate } from "devextreme/localization";
import { Text } from "@chakra-ui/react";

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
      <Text fontWeight="bold">{courseData.course}</Text>
      <Text>{courseData.professor}</Text>
      <Text>
        {formatDate(courseData.startDate, "shortTime")}
        {" - "}
        {formatDate(courseData.endDate, "shortTime")}
      </Text>
    </div>
  );
};
