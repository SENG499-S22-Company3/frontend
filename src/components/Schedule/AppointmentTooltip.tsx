import React from "react";
import { formatDate } from "devextreme/localization";
import { Flex, IconButton, Text } from "@chakra-ui/react";
import { Appointment } from "../../stores/schedule";
import { CloseIcon, EditIcon } from "@chakra-ui/icons";
import Scheduler from "devextreme-react/scheduler";

interface appointmentModel {
  appointmentData: Appointment;
  targetedAppointmentData: Appointment;
}

interface AppointmentTooltipProps {
  model: appointmentModel;
  scheduleRef: React.RefObject<Scheduler>;
}

export const AppointmentTooltip = (props: AppointmentTooltipProps) => {
  const { model, scheduleRef } = props;
  const courseData = model.appointmentData;
  const schedule = scheduleRef?.current?.instance;

  return (
    <>
      <Flex
        flexDirection={"column"}
        mx={"0.5rem"}
        onClick={(e) => e.stopPropagation()}
      >
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Flex>
            <Text fontWeight="bold">
              {courseData.subject} {courseData.courseNumber}
            </Text>
            <Text px={"0.5rem"}>{courseData.section}</Text>
          </Flex>
          <Flex>
            <IconButton
              aria-label="Edit course"
              size="sm"
              icon={<EditIcon />}
              variant={"ghost"}
              onClick={(e) => {
                schedule?.showAppointmentPopup(courseData);
                e.stopPropagation();
              }}
            />
            <IconButton
              aria-label="Close tooltip"
              size="sm"
              icon={<CloseIcon />}
              variant={"ghost"}
              onClick={(e) => {
                schedule?.hideAppointmentTooltip();
                e.stopPropagation();
              }}
            />
          </Flex>
        </Flex>
        <Flex flexDirection={"column"} textAlign={"left"}>
          <Text>{"temp title"}</Text>
          {courseData.prof.map((profName) => (
            <Text pr={"0.5rem"}>{profName}</Text>
          ))}
          <Text>
            {formatDate(courseData.startDate, "shortTime")}
            {" - "}
            {formatDate(courseData.endDate, "shortTime")}
          </Text>
        </Flex>
      </Flex>
    </>
  );
};
