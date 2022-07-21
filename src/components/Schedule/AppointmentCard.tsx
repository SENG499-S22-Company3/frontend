import React from "react";
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
        <Text fontWeight="bold" marginRight={"1.5rem"}>
          {courseData.subject} {courseData.code}
        </Text>
        <Text>{courseData.sectionNumber}</Text>
      </Flex>
      {courseData.professors.map((prof, idx) => (
        <Text key={idx}>{prof}</Text>
      ))}
    </div>
  );
};
