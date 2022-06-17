import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Flex,
  Select,
  Heading,
  Input,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { useLoginStore } from "../stores/login";
import { TableView } from "../components/Schedule/TableView";
import { CalendarView } from "../components/Schedule/CalendarView";
import mockData from "../mockData.json";
import { Course } from "../stores/schedule";

// These schemas will probably change later, all just example data
const SUBMIT = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
      email
      roles
    }
  }
`;

enum ViewTypes {
  table = "table",
  calendar = "calendar",
}

export const Schedule = () => {
  const [viewState, setViewState] = useState(ViewTypes.table);
  const [scheduleState, setScheduleState] = useState<Course[]>(
    mockData.fallTermCourses
  );
  const [submit, { data, loading, error }] = useMutation(SUBMIT);

  const loginState = useLoginStore();
  const navigate = useNavigate();

  const filterCourses = (inputValue: String) => {
    if (inputValue === "") {
      return;
    }

    const input = inputValue.toLowerCase().split(" ");
    const filteredAppointments = mockData.fallTermCourses.filter(
      ({ meetingTime, ...appointment }) => {
        let appointmentValues = "";
        for (const value of Object.values(appointment)) {
          appointmentValues += value.toLowerCase();
        }
        for (const word of input) {
          if (!appointmentValues.includes(word)) {
            return false;
          }
        }
        return true;
      }
    );
    setScheduleState(filteredAppointments);
  };

  useEffect(() => {
    if (loginState.loggedIn) {
      navigate("/");
    }
  }, [loginState.loggedIn, navigate]);

  useEffect(() => {
    if (data && !error && !loading) {
      // TODO: This route will change to whatever The default page is once The
      // user is logged in
      navigate("/");
    }
  }, [data, error, loading, navigate]);

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
          <Input
            placeholder="Search"
            marginX="2rem"
            onChange={(e) => filterCourses(e.target.value)}
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
            {viewState === ViewTypes.calendar && (
              <CalendarView data={scheduleState} />
            )}
          </>
        </Flex>
      </Container>
    </Flex>
  );
};
