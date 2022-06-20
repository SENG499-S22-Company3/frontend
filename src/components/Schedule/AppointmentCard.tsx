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
          {courseData.subject} {courseData.courseNumber}
        </Text>
        <Text>{courseData.section}</Text>
      </Flex>
      <Text fontWeight="bold">{courseData.courseTitle}</Text>
      {courseData.prof.map((profName, idx) => (
        <Text key={idx}>{profName}</Text>
      ))}
      <Text>
        {formatDate(courseData.startDate, "shortTime")}
        {" - "}
        {formatDate(courseData.endDate, "shortTime")}
      </Text>
    </div>
  );
};
