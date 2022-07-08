import React, { useEffect, useRef, useState } from "react";
import { Button, Container, Flex, Select, Heading } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { TableView } from "../components/Schedule/TableView";
import { CalendarView } from "../components/Schedule/CalendarView";
import {
  Appointment,
  CourseSection,
  Day,
  MeetingTime,
} from "../stores/schedule";
import { SearchBar } from "../components/Schedule/SearchBar";
import { ModalItem } from "../components/Schedule/AppointmentModal";
import { weekdayToString } from "../utils/weekdayConversion";

//TO-DO: query for a specific term (fall, spring, summer)
const COURSES = gql`
  query s {
    schedule(year: 2022) {
      id
      year
      createdAt
      courses(term: FALL) {
        CourseID {
          subject
          code
          term
        }
        hoursPerWeek
        professors {
          username
        }
        capacity
        startDate
        endDate
        meetingTimes {
          day
          startTime
          endTime
        }
      }
    }
  }
`;

const mockData = [
  {
    CourseID: {
      subject: "CSC",
      code: "225",
      term: "summer",
      title: "hello world",
    },
    section: "A01",
    hoursPerWeek: 50,
    professors: [],
    capacity: 50,
    startDate: new Date(),
    endDate: new Date(),
    meetingTimes: [
      {
        startTime: new Date(new Date().setHours(new Date().getHours())),
        endTime: new Date(new Date().setHours(new Date().getHours() + 1)),
        day: Day.TUESDAY,
      },
      {
        startTime: new Date(new Date().setHours(new Date().getHours())),
        endTime: new Date(new Date().setHours(new Date().getHours() + 1)),
        day: Day.WEDNESDAY,
      },
      {
        startTime: new Date(new Date().setHours(new Date().getHours())),
        endTime: new Date(new Date().setHours(new Date().getHours() + 1)),
        day: Day.FRIDAY,
      },
    ],
  },
  {
    CourseID: {
      subject: "ECE",
      code: "260",
      term: "summer",
      title: "hello world",
    },
    section: "A01",
    hoursPerWeek: 50,
    professors: [],
    capacity: 50,
    startDate: new Date(),
    endDate: new Date(),
    meetingTimes: [
      {
        startTime: new Date(new Date().setHours(new Date().getHours() - 4)),
        endTime: new Date(new Date().setHours(new Date().getHours() - 3)),
        day: Day.TUESDAY,
      },
      {
        startTime: new Date(new Date().setHours(new Date().getHours() - 4)),
        endTime: new Date(new Date().setHours(new Date().getHours() - 3)),
        day: Day.WEDNESDAY,
      },
      {
        startTime: new Date(new Date().setHours(new Date().getHours() - 4)),
        endTime: new Date(new Date().setHours(new Date().getHours() - 3)),
        day: Day.FRIDAY,
      },
    ],
  },
];

export enum ViewTypes {
  table = "table",
  calendar = "calendar",
}

export const Schedule = () => {
  const {
    data: baseScheduleData,
    loading: scheduleLoading,
    error: scheduleError,
  } = useQuery(COURSES, {});

  const [viewState, setViewState] = useState(ViewTypes.table);
  const [scheduleData, setScheduleData] = useState<CourseSection[]>();
  const baseScheduleRef = useRef(scheduleData);

  useEffect(() => {
    if (baseScheduleData?.schedule && !scheduleError && !scheduleLoading) {
      const courses = baseScheduleData.schedule.courses;
      const coursesId = courses.map((course: CourseSection) => {
        return { ...course, id: Math.floor(Math.random() * 10000) };
      });
      setScheduleData(coursesId);
      baseScheduleRef.current = coursesId;
    }
  }, [baseScheduleData, scheduleError, scheduleLoading]);

  //temp for mockdata
  useEffect(() => {
    //assign courses an id so that they can be referenced if they're edited
    const courses = mockData;
    const coursesId = courses.map((course) => {
      return { ...course, id: Math.floor(Math.random() * 10000) };
    });
    setScheduleData(coursesId);
    baseScheduleRef.current = coursesId;
  }, []);

  useEffect(() => {
    const onUnmount = () => {
      //do graphQL mutation to store new schedule before unmount
    };
    return onUnmount;
  }, []);

  //called after submitting from edit modal
  const handleUpdateSubmit = (updatedCourse: ModalItem) => {
    if (!scheduleData) {
      return;
    }
    const oldCourse = baseScheduleRef.current?.find(
      (course) => course.id === updatedCourse.id
    );

    const newDays = updatedCourse.days;
    const newMeetingTimes = newDays.map((day) => {
      return {
        day: day,
        startTime: updatedCourse.startTime,
        endTime: updatedCourse.endTime,
      } as MeetingTime;
    });
    //filter out old meeting times that overlap the new meeting times, then merge them.
    const oldMeetingTimes =
      oldCourse?.meetingTimes.filter(
        (meeting) =>
          !newDays.includes(meeting.day) &&
          !updatedCourse.removedDays?.includes(meeting.day)
      ) || [];
    const meetingTimes = [...oldMeetingTimes, ...newMeetingTimes];

    const { days, removedDays, ...appointment } = updatedCourse;
    updateSchedule(appointment, meetingTimes, oldCourse);
    refreshSchedule();
  };

  //called after dragging and dropping on the calendar
  const handleDrag = (updatedCourse: Appointment, oldDate: Date) => {
    if (!scheduleData) {
      return;
    }
    const oldCourse = baseScheduleRef.current?.find(
      (course) => course.id === updatedCourse.id
    );

    const day = weekdayToString(updatedCourse.startTime.getDay());
    const newMeetingTime: MeetingTime = {
      day: day,
      startTime: updatedCourse.startTime,
      endTime: updatedCourse.endTime,
    };

    const meetingToRemove = oldCourse?.meetingTimes.findIndex(
      (meeting) =>
        weekdayToString(oldDate.getDay()) === meeting.day &&
        oldDate.getHours() === meeting.startTime.getHours()
    );

    const oldMeetingTimes = oldCourse?.meetingTimes;
    oldMeetingTimes?.splice(meetingToRemove || 0, 1);

    const meetingTimes = [...(oldMeetingTimes || []), newMeetingTime];
    updateSchedule(updatedCourse, meetingTimes, oldCourse);
  };

  //convert calendar appointments into CourseSection object and update state
  const updateSchedule = (
    updatedCourse: Appointment,
    meetingTimes: MeetingTime[],
    oldCourse?: CourseSection
  ) => {
    const professors = updatedCourse.professors.map((prof) => {
      return { displayName: prof };
    });

    const startDate = updatedCourse.startDate || oldCourse?.startDate;
    const endDate = updatedCourse.endDate || oldCourse?.endDate;

    const courseSection = {
      id: updatedCourse.id,
      CourseID: {
        code: updatedCourse.code,
        subject: updatedCourse.subject,
        term: updatedCourse.term,
        title: updatedCourse.title,
      },
      section: updatedCourse.section,
      capacity: updatedCourse.capacity,
      professors: professors,
      startDate: startDate,
      endDate: endDate,
      meetingTimes: meetingTimes,
    } as CourseSection;

    const filteredSchedule = baseScheduleRef.current?.filter(
      (course) => course.id !== courseSection.id
    );
    const newSchedule = [courseSection, ...(filteredSchedule || [])];
    baseScheduleRef.current = newSchedule;
  };

  const refreshSchedule = () => {
    setScheduleData(baseScheduleRef.current);
  };

  const getScheduleRef = () => {
    return baseScheduleRef.current;
  };

  return (
    <Flex
      w="100%"
      minH="calc(100vh - 5.5rem)"
      pt={30}
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Container mb={32} maxW="container.xl">
        <Heading mb={6}>View Schedule</Heading>
        {!baseScheduleData || scheduleError ? (
          <> Failed to fetch course data. Is the backend running? </>
        ) : (
          <>
            <Flex alignItems="center" justifyContent="space-between" mb={5}>
              <Select
                id="select"
                w="10rem"
                value={viewState}
                onChange={(e) => {
                  refreshSchedule();
                  e.target.value === "table"
                    ? setViewState(ViewTypes.table)
                    : setViewState(ViewTypes.calendar);
                }}
              >
                <option value="table">Table View</option>
                <option value="calendar">Calendar View</option>
              </Select>
            </Flex>
            <Flex alignItems="center" justifyContent="space-between" mb={5}>
              <SearchBar
                getTermData={getScheduleRef}
                setScheduleData={setScheduleData}
              />
              <Button
                w="300px"
                as={Link}
                to="/schedule"
                backgroundColor="purple.300"
                colorScheme="purple"
                variant="solid"
              >
                Regenerate
              </Button>
            </Flex>
            <Flex
              p={10}
              borderRadius={10}
              flexDir="column"
              style={{ boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.40)" }}
            >
              <>
                {viewState === ViewTypes.table && scheduleData && (
                  <TableView
                    data={scheduleData}
                    onUpdateSubmit={handleUpdateSubmit}
                  />
                )}
                {viewState === ViewTypes.calendar && scheduleData && (
                  <CalendarView
                    data={scheduleData}
                    onUpdateSubmit={handleUpdateSubmit}
                    onDragSubmit={handleDrag}
                    refreshSchedule={refreshSchedule}
                  />
                )}
              </>
            </Flex>
          </>
        )}
      </Container>
    </Flex>
  );
};