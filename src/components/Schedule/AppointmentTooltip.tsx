import React from "react";
import { formatDate } from "devextreme/localization";
import { Flex, IconButton, Text, useDisclosure } from "@chakra-ui/react";
import { Appointment } from "../../stores/schedule";
import { CloseIcon, EditIcon } from "@chakra-ui/icons";
import Scheduler from "devextreme-react/scheduler";
import { AppointmentModal, ModalItem } from "./AppointmentModal";
import { ViewTypes } from "../../pages/Schedule";
import { weekdayToString } from "../../utils/weekdayConversion";

interface appointmentModel {
  appointmentData: Appointment;
  targetedAppointmentData: Appointment;
}

interface AppointmentTooltipProps {
  model: appointmentModel;
  scheduleRef: React.RefObject<Scheduler>;
  onUpdateSubmit: (updatedCourse: ModalItem) => void;
}

export const AppointmentTooltip = (props: AppointmentTooltipProps) => {
  const { model, scheduleRef, onUpdateSubmit } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();
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
              {courseData.subject} {courseData.code}
            </Text>
            <Text px={"0.5rem"}>{courseData.sectionNumber}</Text>
          </Flex>
          <Flex>
            <IconButton
              aria-label="Edit course"
              size="sm"
              icon={<EditIcon />}
              variant={"ghost"}
              onClick={(e) => {
                schedule?.hideAppointmentTooltip();
                onOpen();
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
          <Text marginBottom={"0.5rem"}>{courseData.title}</Text>
          <Flex>
            <Text fontWeight={"bold"} marginRight={"0.25rem"}>
              {courseData.capacity}
            </Text>
            <Text>Students</Text>
          </Flex>
          {courseData.professors.map((prof) => (
            <Text pr={"0.5rem"}>{prof}</Text>
          ))}
          <Text>
            {formatDate(courseData.startTime, "shortTime")}
            {" - "}
            {formatDate(courseData.endTime, "shortTime")}
          </Text>
        </Flex>
      </Flex>
      <AppointmentModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onUpdateSubmit}
        courseData={{
          ...courseData,
          days: [weekdayToString(courseData.startTime.getDay())],
        }}
        viewState={ViewTypes.calendar}
      />
    </>
  );
};
