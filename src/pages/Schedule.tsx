import React, { useEffect, useState } from "react";
import { Button, Container, Flex, Select, Heading } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { TableView } from "../components/Schedule/TableView";
import { CalendarView } from "../components/Schedule/CalendarView";
import { CourseSection } from "../stores/schedule";
import { SearchBar } from "../components/Schedule/SearchBar";

//TO-DO: query for a specific term (fall, spring, summer)
const COURSES = gql`
  query GetCourses {
    courses {
      CourseID {
        subject
        code
        term
      }
      capacity
      professors {
        username
      }
      startDate
      endDate
      meetingTimes {
        day
        startTime
        endTime
      }
    }
  }
`;

enum ViewTypes {
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

  useEffect(() => {
    if (baseScheduleData && !scheduleError && !scheduleLoading) {
      setScheduleData(baseScheduleData.courses);
    }
  }, [baseScheduleData, scheduleError, scheduleLoading]);

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
                w="16rem"
                value={viewState}
                onChange={(e) =>
                  e.target.value === "table"
                    ? setViewState(ViewTypes.table)
                    : setViewState(ViewTypes.calendar)
                }
              >
                <option value="table">Table View</option>
                <option value="calendar">Calendar View</option>
              </Select>
              <SearchBar
                termData={baseScheduleData.courses}
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
                Generate New Schedule
              </Button>
            </Flex>
            <Flex
              p={10}
              borderRadius={10}
              flexDir="column"
              style={{ boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.40)" }}
            >
              <>
                {viewState === ViewTypes.table && <TableView />}
                {viewState === ViewTypes.calendar && scheduleData && (
                  <CalendarView data={scheduleData} />
                )}
              </>
            </Flex>
          </>
        )}
      </Container>
    </Flex>
  );
};
