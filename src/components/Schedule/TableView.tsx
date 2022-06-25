import { CourseSection } from "../../stores/schedule";

import { Table, Thead, Tbody, Tr, Th, TableContainer } from "@chakra-ui/react";

const populateTable = (courses: CourseSection[]) => {
  var table_b = document.getElementById("table_body");
  if (table_b != null) {
    //remove previous table
    // if (table_b.childNodes.length !== 0){
    //   while(table_b.childNodes.length > 0){
    //     table_b.childNodes[0].remove();
    //   }
    // }
    var nTd, nTr;
    for (var i = 0; i < courses.length; i++) {
      nTr = document.createElement("Tr");

      //Course title
      nTd = document.createElement("Td");
      nTd.style.padding = "8px 16px";
      nTd.innerText =
        courses[i].CourseID.subject + " " + courses[i].CourseID.code;
      nTr.appendChild(nTd);

      //Schedule time
      nTd = document.createElement("Td");
      nTd.style.padding = "8px 16px";
      nTd.innerText =
        courses[i].meetingTimes[0].startTime +
        " / " +
        courses[i].meetingTimes[0].endTime;
      nTr.appendChild(nTd);

      //Days
      nTd = document.createElement("Td");
      nTd.style.padding = "8px 16px";
      var days = "";
      var len = courses[i].meetingTimes.length;
      for (var y = 0; y < len; y++) {
        days = days + courses[i].meetingTimes[y].day.slice(0, 3) + " ";
      }
      nTd.innerText = days;
      nTr.appendChild(nTd);

      //Term
      nTd = document.createElement("Td");
      nTd.style.padding = "8px 16px";
      nTd.innerText = courses[i].CourseID.term;
      nTr.appendChild(nTd);

      //Prof
      nTd = document.createElement("Td");
      nTd.style.padding = "8px 16px";
      nTd.innerText = courses[i].professors[0].username;
      nTr.appendChild(nTd);

      //Course section
      nTd = document.createElement("Td");
      nTd.style.padding = "8px 16px";
      nTd.innerText = "section";
      nTr.appendChild(nTd);

      //Start/End Data
      nTd = document.createElement("Td");
      nTd.style.padding = "8px 16px";
      nTd.innerText = courses[i].startDate + " / " + courses[i].endDate;
      nTr.appendChild(nTd);

      //# of students
      nTd = document.createElement("Td");
      nTd.style.padding = "8px 16px";
      nTd.innerText = courses[i].capacity.toString();
      nTr.appendChild(nTd);
      table_b?.appendChild(nTr);
    }
  } else {
    setTimeout(function () {
      populateTable(courses);
    }, 100);
  }
};

interface TableProps {
  data: CourseSection[];
}

export const TableView = (props: TableProps) => {
  const { data } = props;
  console.log(data);
  // const appointments = buildAppointments(data);
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
            <Th>Students</Th>
          </Tr>
        </Thead>
        <Tbody id="table_body"></Tbody>
      </Table>
    </TableContainer>
  );
};
