import { CourseSection } from "../../stores/schedule";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";

interface TableProps {
  data: CourseSection[];
}

export const TableView = (props: TableProps) => {
  const { data } = props;

  var tableData = [
    {
      course: "",
      schedule_time: "",
      days: "",
      term: "",
      prof: "",
      section: "",
      start_end: "",
      capacity: "",
    },
  ];

  const populateTable = (courses: CourseSection[]) => {
    tableData.pop();

    for (var i = 0; i < courses.length; i++) {
      var d = "";
      var len = courses[i].meetingTimes.length;
      for (var y = 0; y < len; y++) {
        d = d + courses[i].meetingTimes[y].day.slice(0, 3) + " ";
      }
      tableData.push({
        course: courses[i].CourseID.subject + " " + courses[i].CourseID.code,
        schedule_time:
          courses[i].meetingTimes[0].startTime +
          " / " +
          courses[i].meetingTimes[0].endTime,
        days: d,
        term: courses[i].CourseID.term,
        prof: courses[i].professors[0].username,
        section: (i + 1).toString(),
        start_end: courses[i].startDate + " / " + courses[i].endDate,
        capacity: courses[i].capacity.toString(),
      });
    }
  };

  populateTable(data);

  return (
    <TableContainer overflowY="auto">
      <Table size="sm" variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>Course</Th>
            <Th>Schedule Time</Th>
            <Th>Days</Th>
            <Th>Term</Th>
            <Th>Prof/InsTructor</Th>
            <Th>Section</Th>
            <Th>Start/End Date</Th>
            <Th>Capacity</Th>
          </Tr>
        </Thead>
        <Tbody id="table_body">
          {tableData.map((item) => (
            <Tr key={item.section}>
              <Td>{item.course}</Td>
              <Td>{item.schedule_time}</Td>
              <Td>{item.days}</Td>
              <Td>{item.term}</Td>
              <Td>{item.prof}</Td>
              <Td>{item.section}</Td>
              <Td>{item.start_end}</Td>
              <Td>{item.capacity}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
