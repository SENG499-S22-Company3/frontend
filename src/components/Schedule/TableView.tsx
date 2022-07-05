import { Appointment, CourseSection } from "../../stores/schedule";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { formatDate, formatTimeString } from "../../utils/formatDate";
import { EditIcon } from "@chakra-ui/icons";
import { AppointmentModal, ModalItem } from "./AppointmentModal";
import { useState } from "react";
import { ViewTypes } from "../../pages/Schedule";

interface TableProps {
  data: CourseSection[];
  onUpdateSubmit: (updatedCourse: ModalItem) => void;
}

const formatTableItem = (course: CourseSection) => {
  var d = "";
  var len = course.meetingTimes.length;
  for (var y = 0; y < len; y++) {
    d = d + course.meetingTimes[y].day.slice(0, 3) + " ";
  }

  const startTime = new Date(course.meetingTimes[0].startTime);
  const endTime = new Date(course.meetingTimes[0].endTime);
  const [, startMinutes] = formatTimeString(startTime);
  const [, endMinutes] = formatTimeString(endTime);

  const startDate = new Date(course.startDate);
  const endDate = new Date(course.endDate);

  const professors = course.professors
    .map((prof) => prof.displayName)
    .join(" ");

  return {
    course: course.CourseID.subject + " " + course.CourseID.code,
    schedule_time:
      startTime.getHours() +
      ":" +
      startMinutes +
      "/" +
      endTime.getHours() +
      ":" +
      endMinutes,
    days: d,
    term: course.CourseID.term,
    prof: professors, //not in schema
    section: "temp", //not in schema
    start_end: formatDate(startDate) + " / " + formatDate(endDate),
    capacity: course.capacity.toString(),
  };
};

export const TableView = (props: TableProps) => {
  const { data, onUpdateSubmit } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCourse, setSelectedCourse] = useState<ModalItem | null>(null);

  const handleUpdateSubmit = (updatedCourse: ModalItem) => {
    setSelectedCourse(null);
    onUpdateSubmit(updatedCourse);
  };

  return (
    <>
      <TableContainer overflowY="auto">
        <Table size="sm" variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Course</Th>
              <Th>Schedule Time</Th>
              <Th>Days</Th>
              <Th>Term</Th>
              <Th>Prof/Instructor</Th>
              <Th>Section</Th>
              <Th>Start/End Date</Th>
              <Th>Capacity</Th>
              <Th>Edit</Th>
            </Tr>
          </Thead>
          <Tbody id="table_body">
            {data.map((course, index) => {
              const item = formatTableItem(course);
              const modalItem = {
                id: course.id,
                ...course.CourseID,
                professors: course.professors.map((prof) => prof.displayName),
                startTime: new Date(course.meetingTimes[0].startTime),
                endTime: new Date(course.meetingTimes[0].endTime),
                startDate: course.startDate,
                endDate: course.endDate,
                capacity: course.capacity,
                days: course.meetingTimes.map((meeting) => meeting.day),
              } as ModalItem;
              return (
                <Tr key={index}>
                  <Td>{item.course}</Td>
                  <Td>{item.schedule_time}</Td>
                  <Td>{item.days}</Td>
                  <Td>{item.term}</Td>
                  <Td>{item.prof}</Td>
                  <Td>{item.section}</Td>
                  <Td>{item.start_end}</Td>
                  <Td>{item.capacity}</Td>
                  <Td>
                    <IconButton
                      aria-label="Edit course"
                      size="sm"
                      icon={<EditIcon />}
                      variant={"ghost"}
                      onClick={() => {
                        setSelectedCourse(modalItem);
                        onOpen();
                      }}
                    />
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      {selectedCourse && (
        <AppointmentModal
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={handleUpdateSubmit}
          courseData={selectedCourse}
          viewState={ViewTypes.table}
        />
      )}
    </>
  );
};
