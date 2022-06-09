import React from "react";
import { formatDate } from "devextreme/localization";
import { Text } from "@chakra-ui/react";
import { Appointment } from "../../stores/schedule";

interface appointmentModel {
  appointmentData: Appointment;
  targetedAppointmentData: Appointment;
}

export const AppointmentCard = (model: appointmentModel) => {
  const courseData = model.appointmentData;
  return (
    <div>
      <Text fontWeight="bold">{courseData.courseTitle}</Text>
      <Text>{courseData.prof}</Text>
      <Text>
        {formatDate(courseData.startDate, "shortTime")}
        {" - "}
        {formatDate(courseData.endDate, "shortTime")}
      </Text>
    </div>
  );
};
