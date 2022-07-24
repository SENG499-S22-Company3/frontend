import { CourseSection } from "../../stores/schedule";
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
import {
  formatAMPM,
  formatDate,
  getScheduleTime,
  sortWeekDays,
} from "../../utils/formatDate";
import { EditIcon } from "@chakra-ui/icons";
import { AppointmentModal, ModalItem } from "./AppointmentModal";
import { useState } from "react";
import { ViewTypes } from "../../pages/Schedule";

interface TableProps {
  data: CourseSection[];
  onUpdateSubmit: (updatedCourse: ModalItem) => void;
}

const formatTableItem = (course: CourseSection) => {
  let d: string[] = [];
  var len = course.meetingTimes.length;
  for (var y = 0; y < len; y++) {
    d.push(course.meetingTimes[y].day.slice(0, 3));
  }
  d = sortWeekDays(d);

  const startTime = formatAMPM(new Date(course.meetingTimes[0].startTime));
  const endTime = formatAMPM(new Date(course.meetingTimes[0].endTime));

  const startDate = new Date(course.startDate);
  const endDate = new Date(course.endDate);

  const professors = course.professors
    .map((prof) => prof.displayName)
    .join(" ");

  return {
    course: course.CourseID.subject + " " + course.CourseID.code,
    schedule_time: startTime + " / " + endTime,
    days: d.join(" "),
    term: course.CourseID.term,
    prof: professors,
    sectionNumber: course.sectionNumber,
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

  const handleUpdateClose = () => {
    setSelectedCourse(null);
    onClose();
  };

  data.sort((a, b) => {
    if (a.CourseID.subject === b.CourseID.subject) {
      return a.CourseID.code > b.CourseID.code ? 1 : -1;
    }
    return a.CourseID.subject > b.CourseID.subject ? 1 : -1;
  });
  return (
    <>
      <TableContainer overflowY="auto">
        <Table size="sm" variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Course</Th>
              <Th>Schedule Time</Th>
              <Th>Days</Th>
              <Th>Prof/Instructor</Th>
              <Th>Section</Th>
              <Th>Term</Th>
              <Th>Start/End Date</Th>
              <Th>Capacity</Th>
              <Th>Edit</Th>
            </Tr>
          </Thead>
          <Tbody id="table_body">
            {data.map((course, index) => {
              const item = formatTableItem(course);
              const modalItem = {
                ...course.CourseID,
                ...course,
                id: course.id,
                professors: course.professors.map((prof) => prof.displayName),
                startDate: new Date(course.startDate),
                endDate: new Date(course.endDate),
                startTime: getScheduleTime(course.meetingTimes[0].startTime),
                endTime: getScheduleTime(course.meetingTimes[0].endTime),
                days: course.meetingTimes.map((meeting) => meeting.day),
              } as ModalItem;
              return (
                <Tr key={index}>
                  <Td>{item.course}</Td>
                  <Td>{item.schedule_time}</Td>
                  <Td>{item.days}</Td>
                  <Td>{item.prof}</Td>
                  <Td>{item.sectionNumber}</Td>
                  <Td>{item.term}</Td>
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
          onClose={handleUpdateClose}
          onSubmit={handleUpdateSubmit}
          courseData={selectedCourse}
          viewState={ViewTypes.table}
        />
      )}
    </>
  );
};
