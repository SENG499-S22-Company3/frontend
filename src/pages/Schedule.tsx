import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Flex,
  Select,
  Heading,
  Spinner,
  useColorMode,
  IconButton,
  Text,
  FormLabel,
  RadioGroup,
  Radio,
  Stack,
} from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";
import { TableView } from "../components/Schedule/TableView";
import { CalendarView } from "../components/Schedule/CalendarView";
import { Appointment, CourseSection, MeetingTime } from "../stores/schedule";
import { SearchBar } from "../components/Schedule/SearchBar";
import { ModalItem } from "../components/Schedule/AppointmentModal";
import { weekdayToString } from "../utils/weekdayConversion";
import { getUTCDate } from "../utils/formatDate";
import { SubmitButton } from "../components/Schedule/SubmitButton";
import Themes from "devextreme/ui/themes";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

//TO-DO: query for a specific term (fall, spring, summer)
const COURSES = gql`
  query s($year: Int!) {
    schedule(year: $year) {
      id
      year
      createdAt
      courses(term: SUMMER) {
        CourseID {
          subject
          title
          code
          term
        }
        hoursPerWeek
        professors {
          displayName
        }
        capacity
        startDate
        endDate
        sectionNumber
        meetingTimes {
          day
          startTime
          endTime
        }
      }
    }
  }
`;

const USERS = gql`
  query getUsers {
    allUsers {
      username
      displayName
    }
  }
`;

export interface User {
  displayName: string;
  username: string;
}

export enum ViewTypes {
  table = "table",
  calendar = "calendar",
}

export const Schedule = () => {
  const [year, setYear] = useState(2022);

  const {
    data: baseScheduleData,
    loading: scheduleLoading,
    error: scheduleError,
  } = useQuery(COURSES, {
    variables: { year },
    fetchPolicy: "cache-and-network",
  });
  const { data, loading, error } = useQuery(USERS);

  const { colorMode } = useColorMode();
  const [userData, setUserData] = useState<User[]>();
  const [isEditing, setIsEditing] = useState(false);
  const [viewState, setViewState] = useState(ViewTypes.table);
  const [scheduleData, setScheduleData] = useState<CourseSection[]>();
  const [calendarView, setCalendarView] = useState<"workWeek" | "day">(
    "workWeek"
  );
  const [dayViewCount, setDayViewCount] = useState(1);
  const [termFilter, setTermFilter] = useState<
    "ALL" | "FALL" | "SPRING" | "SUMMER"
  >("ALL");

  const termFilteredSchedule =
    termFilter === "ALL"
      ? scheduleData
      : scheduleData?.filter((course) => course.CourseID.term === termFilter);

  const baseScheduleRef = useRef(scheduleData);

  useEffect(() => {
    if (baseScheduleData?.schedule && !scheduleError && !scheduleLoading) {
      const cleanPayload = JSON.parse(
        JSON.stringify(baseScheduleData.schedule.courses, (name, val) => {
          if (name === "__typename") {
            delete val[name];
          } else {
            return val;
          }
        })
      );
      const coursesId = cleanPayload.map((course: CourseSection) => {
        return { ...course, id: Math.floor(Math.random() * 10000) };
      });
      setYear(baseScheduleData.schedule.year);
      setScheduleData(coursesId);
      baseScheduleRef.current = coursesId;
    }
  }, [baseScheduleData, scheduleError, scheduleLoading]);

  useEffect(() => {
    if (!loading) {
      if (!error && data) {
        const userData = data.allUsers;
        setUserData(userData);
      } else {
        console.log(error);
      }
    }
  }, [data, error, loading]);

  useEffect(() => {
    colorMode === "light"
      ? Themes.current("generic.light")
      : Themes.current("generic.dark");
  }, [colorMode]);

  useEffect(() => {
    const onUnmount = () => {
      //do graphQL mutation to store new schedule before unmount
    };
    return onUnmount;
  }, []);

  const changeYear = (newYear: string) => {
    if (newYear !== null && newYear !== "") {
      setYear(parseInt(newYear));
    }
  };
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
        startTime: getUTCDate(updatedCourse.startTime),
        endTime: getUTCDate(updatedCourse.endTime),
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
    setIsEditing(true);
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
      startTime: getUTCDate(updatedCourse.startTime),
      endTime: getUTCDate(updatedCourse.endTime),
    };

    const oldMeetingTimes = oldCourse?.meetingTimes || [];
    const meetingToRemove = oldMeetingTimes?.findIndex(
      (meeting) =>
        weekdayToString(oldDate.getDay()) === meeting.day &&
        oldDate.getHours() === new Date(meeting.startTime).getUTCHours()
    );

    const filteredMeetingTimes = [...oldMeetingTimes];
    filteredMeetingTimes.splice(meetingToRemove || 0, 1);

    const meetingTimes = [...filteredMeetingTimes, newMeetingTime];
    updateSchedule(updatedCourse, meetingTimes, oldCourse);
  };

  //convert calendar appointments into course sections and update state
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
      hoursPerWeek: updatedCourse.hoursPerWeek,
      sectionNumber: updatedCourse.sectionNumber,
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
    return baseScheduleRef.current || [];
  };

  return (
    <Flex
      w="100%"
      minH="calc(100vh - 5.5rem)"
      pt={100}
      alignItems="center"
      flexDirection="column"
    >
      <Heading>View Schedule</Heading>
      <FormLabel htmlFor="year">For Year:</FormLabel>
      <Select
        placeholder="Select Year"
        disabled={scheduleLoading}
        defaultValue={year}
        onChange={(e) => changeYear(e.target.value)}
        mb={5}
        w="10rem"
      >
        <option value="2022">2022</option>
        <option value="2023">2023</option>
        <option value="2024">2024</option>
      </Select>

      <Container mb={32} maxW="container.xl">
        <Flex alignItems="center" justifyContent="space-between" mb={5}>
          <Select
            id="select"
            w="8rem"
            value={viewState}
            onChange={(e) => {
              refreshSchedule();
              e.target.value === "table"
                ? setViewState(ViewTypes.table)
                : setViewState(ViewTypes.calendar);
            }}
          >
            <option value="table">Table</option>
            <option value="calendar">Calendar</option>
          </Select>
          <RadioGroup defaultValue={termFilter}>
            <Stack direction="row">
              <Radio
                colorScheme="teal"
                onChange={() => setTermFilter("ALL")}
                value="ALL"
              >
                All
              </Radio>
              <Radio
                colorScheme="orange"
                onChange={() => setTermFilter("FALL")}
                value="FALL"
              >
                Fall
              </Radio>
              <Radio
                colorScheme="green"
                onChange={() => setTermFilter("SPRING")}
                value="SPRING"
              >
                Spring
              </Radio>
              <Radio
                colorScheme="red"
                onChange={() => setTermFilter("SUMMER")}
                value="SUMMER"
              >
                Summer
              </Radio>
            </Stack>
          </RadioGroup>
          <SearchBar
            getTermData={getScheduleRef}
            setScheduleData={setScheduleData}
          />
          <SubmitButton
            getScheduleData={getScheduleRef}
            scheduleId={baseScheduleData?.schedule?.id}
            userData={userData || []}
            active={isEditing}
            setActive={setIsEditing}
            refreshSchedule={refreshSchedule}
          />
        </Flex>
        {scheduleLoading ? (
          <Container
            display="flex"
            justifyContent="center"
            alignItems="center"
            marginTop="4rem"
          >
            <Spinner size="xl" />
          </Container>
        ) : (
          <>
            {baseScheduleData && !baseScheduleData.schedule ? (
              <Text m={5} textAlign="center">
                No schedules generated for year: {year}
              </Text>
            ) : (
              <Flex
                p={10}
                paddingTop={"0.5rem"}
                borderRadius={10}
                flexDir="column"
                style={{ boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.40)" }}
              >
                {viewState === ViewTypes.calendar && (
                  <Flex
                    justifyContent={"space-between"}
                    alignItems="center"
                    marginBottom="0.5rem"
                  >
                    <Flex
                      alignItems={"center"}
                      visibility={calendarView === "day" ? "visible" : "hidden"}
                    >
                      {dayViewCount > 1 && (
                        <IconButton
                          aria-label="Day backward"
                          icon={<ChevronLeftIcon />}
                          variant={"ghost"}
                          size="lg"
                          onClick={() => setDayViewCount(dayViewCount - 1)}
                        />
                      )}
                      <Text>{weekdayToString(dayViewCount)}</Text>
                      {dayViewCount < 5 && (
                        <IconButton
                          aria-label="Day forward"
                          icon={<ChevronRightIcon />}
                          variant={"ghost"}
                          size="lg"
                          onClick={() => setDayViewCount(dayViewCount + 1)}
                        />
                      )}
                    </Flex>
                    <Select
                      id="select"
                      w="6rem"
                      value={calendarView}
                      onChange={(e) => {
                        refreshSchedule();
                        e.target.value === "day"
                          ? setCalendarView("day")
                          : setCalendarView("workWeek");
                      }}
                    >
                      <option value="day">DAY</option>
                      <option value="workWeek">WEEK</option>
                    </Select>
                  </Flex>
                )}
                {viewState === ViewTypes.table && scheduleData && (
                  <TableView
                    data={termFilteredSchedule || []}
                    onUpdateSubmit={handleUpdateSubmit}
                  />
                )}
                {viewState === ViewTypes.calendar && scheduleData && (
                  <CalendarView
                    data={termFilteredSchedule || []}
                    onUpdateSubmit={handleUpdateSubmit}
                    onDragSubmit={handleDrag}
                    viewState={calendarView}
                    dayCount={dayViewCount}
                  />
                )}
              </Flex>
            )}
          </>
        )}
      </Container>
    </Flex>
  );
};
