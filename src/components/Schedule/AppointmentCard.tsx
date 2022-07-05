import React from "react";
import { formatDate } from "devextreme/localization";
import { Flex, Text } from "@chakra-ui/react";
import { Appointment } from "../../stores/schedule";

interface appointmentModel {
  appointmentData: Appointment;
  targetedAppointmentData: Appointment;
}

export const AppointmentCard = (model: appointmentModel) => {
  const courseData = model.appointmentData;
  return (
    <div>
      <Flex justifyContent={"space-between"}>
        <Text fontWeight="bold">
          {courseData.subject} {courseData.code}
        </Text>
        <Text>{courseData.section}</Text>
      </Flex>
      <Text fontWeight="bold">{courseData.title}</Text>
      {courseData.professors.map((prof, idx) => (
        <Text key={idx}>{prof}</Text>
      ))}
      <Text>
        {formatDate(courseData.startTime, "shortTime")}
        {" - "}
        {formatDate(courseData.endTime, "shortTime")}
      </Text>
    </div>
  );
};
