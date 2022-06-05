import React, { useEffect, useState } from "react";
import { Button, Container, Flex, Select, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { useLoginStore } from "../stores/login";
import { TableView } from "../components/Schedule/TableView";
import { CalendarView } from "../components/Schedule/CalendarView";

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

export const Schedule = () => {
  const [viewState, setViewState] = useState("table");
  const [submit, { data, loading, error }] = useMutation(SUBMIT);

  const loginState = useLoginStore();
  const navigate = useNavigate();

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
        <Button
          mb={5}
          w="300px"
          as={Link}
          to="/schedule"
          backgroundColor="#8e44ad"
          colorScheme="purple"
          textColor="#ffffff"
          variant="solid"
          float="right"
        >
          Generate New Schedule
        </Button>
        <Select
          id="select"
          w="160px"
          value={viewState}
          mb={5}
          onChange={(e) => setViewState(e.target.value)}
        >
          <option value="table">Table View</option>
          <option value="calendar">Calendar View</option>
        </Select>
        <Flex
          bg="#212938"
          p={10}
          borderRadius={10}
          flexDir="column"
          style={{ boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.40)" }}
        >
          <>
            {viewState === "table" && <TableView />}
            {viewState === "calendar" && <CalendarView />}
          </>
        </Flex>
      </Container>
    </Flex>
  );
};
