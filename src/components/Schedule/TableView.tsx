import React from "react";
import { Appointment, CourseSection } from "../../stores/schedule";
import { weekdayToInt } from "../../utils/weekdayToInt";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { waitFor } from "@testing-library/react";

//course assignments that are flagged to be on multiple days should be set for those days
const splitCourseDays = (course: CourseSection) => {
  const splitDays = course.meetingTimes.map((meetingTime) => {
    const { startTime, endTime, day } = meetingTime;

    //2022-05-31T is a monday, and we just need the base to be a monday
    //HH:MM:SS.000-7:00 for time format, it comes in HHMM format.
    const beginHoursMinutes = [
      startTime.slice(0, startTime.length / 2),
      startTime.slice(-startTime.length / 2),
    ];
    const endHourMinutes = [
      endTime.slice(0, endTime.length / 2),
      endTime.slice(-endTime.length / 2),
    ];

    const start =
      "2022-05-31T" +
      beginHoursMinutes[0] +
      ":" +
      beginHoursMinutes[1] +
      ":00.000-07:00";
    const end =
      "2022-05-31T" +
      endHourMinutes[0] +
      ":" +
      endHourMinutes[1] +
      ":00.000-07:00";

    const startDate = new Date(start);
    const endDate = new Date(end);

    //change the date based on what day of the week it's supposed to be
    const dayShift = weekdayToInt(day);
    startDate.setDate(startDate.getDate() + dayShift - 1);
    endDate.setDate(endDate.getDate() + dayShift - 1);

    const meetingDays = {
      startDate: startDate,
      endDate: endDate,
    };

    return meetingDays;
  });

  return splitDays;
};

//convert Course object data from backend to the structure DevExtreme expects
const buildAppointments = (courses: CourseSection[]) => {
  const appointments = courses.flatMap((course) => {
    const professors = course.professors.map((prof) => prof.username); //TO-DO switch to displayName, when its in schema

    const assignedCourses = splitCourseDays(course).map((meetingTime) => {
      return {
        courseTitle: course.CourseID.code, //not in schema yet
        courseNumber: course.CourseID.code,
        subject: course.CourseID.subject,
        section: "TEMP_SECTION", //not in schema yet
        prof: professors,
        classSize: course.capacity,
        startDate: meetingTime.startDate,
        endDate: meetingTime.endDate,
      } as Appointment;
    });

    return assignedCourses;
  });
  return appointments;
};

const populateTable = (courses: Appointment[])=>{
  var table_b = document.getElementById("table_body");
  if (table_b != null){
    //remove previous table
    if (table_b.childNodes.length != 0){
      while(table_b.childNodes.length > 0){
        console.log(table_b.childNodes);
        table_b.childNodes[0].remove();
      }
    }

    for (var i = 0;i < courses.length; i++){
      console.log(courses[i]);
      var nTr = document.createElement('Tr');
      var sdate = courses[i].startDate.toString().split(' ').slice(0, 4).join(' ');
      var stime = courses[i].startDate.toString().split(' ').slice(4, 5).join(' ');
      var edate = courses[i].endDate.toString().split(' ').slice(0, 4).join(' ');
      var etime = courses[i].endDate.toString().split(' ').slice(4, 5).join(' ')
      //Course title
      var nTd = document.createElement('Td');
      nTd.style.padding = "8px 16px";
      nTd.innerText = courses[i].subject + " " + courses[i].courseTitle;
      nTr.appendChild(nTd);
  
      //Schedule time
      var nTd = document.createElement('Td');
      nTd.style.padding = "8px 16px";
      nTd.innerText = stime + " / " + etime;
      nTr.appendChild(nTd);
  
      //Term
      var nTd = document.createElement('Td');
      nTd.style.padding = "8px 16px";
      nTd.innerText = "Summer";
      nTr.appendChild(nTd);
  
      //Prof
      var nTd = document.createElement('Td');
      nTd.style.padding = "8px 16px";
      nTd.innerText = courses[i].prof[0];
      nTr.appendChild(nTd);
  
      //Course Code
      var nTd = document.createElement('Td');
      nTd.style.padding = "8px 16px";
      nTd.innerText = courses[i].section;
      nTr.appendChild(nTd);
  
      //Start/End Data
      var nTd = document.createElement('Td');
      nTd.style.padding = "8px 16px";
      nTd.innerText = sdate + " / " + edate;
      nTr.appendChild(nTd);
  
      //# of students
      var nTd = document.createElement('Td');
      nTd.style.padding = "8px 16px";
      nTd.innerText = courses[i].classSize.toString();
      nTr.appendChild(nTd);
      table_b?.appendChild(nTr);
    }
  }
  
  
  
} 

interface TableProps {
  data: CourseSection[];
}

export const TableView = (props: TableProps) => {
  const { data } = props;
  const appointments = buildAppointments(data);
  populateTable(appointments);
  return (
    <TableContainer overflowY="auto">
      <Table size="sm" variant="striped" colorScheme="gray" >
        <Thead>
          <Tr>
            <Th>Course</Th>
            <Th>Schedule Time</Th>
            <Th>Term</Th>
            <Th>Prof/InsTructor</Th>
            <Th>CRN</Th>
            <Th>Start/End Date</Th>
            <Th>Students</Th>
          </Tr>
        </Thead>
        <Tbody
          id = "table_body" 
        >
        </Tbody>
      </Table>
    </TableContainer>
  );
};
