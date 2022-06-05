import {
  Button,
  Container,
  Flex,
  Select,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { useLoginStore } from "../stores/login";

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
  const [selectValue, setSelectValue] = useState("");
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
      <Container mb={32} maxW="container.xlg">
        <Heading mb={6}>View Schedule</Heading>
        <Flex alignItems="center" justifyContent="space-between" mb={5}>
          <Select
            id="select"
            w="160px"
            value={selectValue}
            onChange={(e) => setSelectValue(e.target.value)}
          >
            <option value="table">Table View</option>
            <option value="calendar">Calendar View</option>
          </Select>

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
          <TableContainer overflowY="auto">
            <Table size="sm" variant="striped" colorScheme="gray">
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
              <Tbody>
                <Tr>
                  <Td>SENG 499</Td>
                  <Td>Wed: 1500-1620</Td>
                  <Td>Summer</Td>
                  <Td>Daniela Damian</Td>
                  <Td>30792</Td>
                  <Td>Wed May 04, 2022 - Fri Jul 29, 2022</Td>
                  <Td>82</Td>
                </Tr>
                <Tr>
                  <Td>SENG 499</Td>
                  <Td>Wed: 1500-1620</Td>
                  <Td>Summer</Td>
                  <Td>Daniela Damian</Td>
                  <Td>30792</Td>
                  <Td>Wed May 04, 2022 - Fri Jul 29, 2022</Td>
                  <Td>82</Td>
                </Tr>
                <Tr>
                  <Td>SENG 499</Td>
                  <Td>Wed: 1500-1620</Td>
                  <Td>Summer</Td>
                  <Td>Daniela Damian</Td>
                  <Td>30792</Td>
                  <Td>Wed May 04, 2022 - Fri Jul 29, 2022</Td>
                  <Td>82</Td>
                </Tr>
                <Tr>
                  <Td>SENG 499</Td>
                  <Td>Wed: 1500-1620</Td>
                  <Td>Summer</Td>
                  <Td>Daniela Damian</Td>
                  <Td>30792</Td>
                  <Td>Wed May 04, 2022 - Fri Jul 29, 2022</Td>
                  <Td>82</Td>
                </Tr>
                <Tr>
                  <Td>SENG 499</Td>
                  <Td>Wed: 1500-1620</Td>
                  <Td>Summer</Td>
                  <Td>Daniela Damian</Td>
                  <Td>30792</Td>
                  <Td>Wed May 04, 2022 - Fri Jul 29, 2022</Td>
                  <Td>82</Td>
                </Tr>
                <Tr>
                  <Td>SENG 499</Td>
                  <Td>Wed: 1500-1620</Td>
                  <Td>Summer</Td>
                  <Td>Daniela Damian</Td>
                  <Td>30792</Td>
                  <Td>Wed May 04, 2022 - Fri Jul 29, 2022</Td>
                  <Td>82</Td>
                </Tr>
                <Tr>
                  <Td>SENG 499</Td>
                  <Td>Wed: 1500-1620</Td>
                  <Td>Summer</Td>
                  <Td>Daniela Damian</Td>
                  <Td>30792</Td>
                  <Td>Wed May 04, 2022 - Fri Jul 29, 2022</Td>
                  <Td>82</Td>
                </Tr>
                <Tr>
                  <Td>SENG 499</Td>
                  <Td>Wed: 1500-1620</Td>
                  <Td>Summer</Td>
                  <Td>Daniela Damian</Td>
                  <Td>30792</Td>
                  <Td>Wed May 04, 2022 - Fri Jul 29, 2022</Td>
                  <Td>82</Td>
                </Tr>
                <Tr>
                  <Td>SENG 499</Td>
                  <Td>Wed: 1500-1620</Td>
                  <Td>Summer</Td>
                  <Td>Daniela Damian</Td>
                  <Td>30792</Td>
                  <Td>Wed May 04, 2022 - Fri Jul 29, 2022</Td>
                  <Td>82</Td>
                </Tr>
                <Tr>
                  <Td>SENG 499</Td>
                  <Td>Wed: 1500-1620</Td>
                  <Td>Summer</Td>
                  <Td>Daniela Damian</Td>
                  <Td>30792</Td>
                  <Td>Wed May 04, 2022 - Fri Jul 29, 2022</Td>
                  <Td>82</Td>
                </Tr>
                <Tr>
                  <Td>SENG 499</Td>
                  <Td>Wed: 1500-1620</Td>
                  <Td>Summer</Td>
                  <Td>Daniela Damian</Td>
                  <Td>30792</Td>
                  <Td>Wed May 04, 2022 - Fri Jul 29, 2022</Td>
                  <Td>82</Td>
                </Tr>
                <Tr>
                  <Td>SENG 499</Td>
                  <Td>Wed: 1500-1620</Td>
                  <Td>Summer</Td>
                  <Td>Daniela Damian</Td>
                  <Td>30792</Td>
                  <Td>Wed May 04, 2022 - Fri Jul 29, 2022</Td>
                  <Td>82</Td>
                </Tr>
                <Tr>
                  <Td>SENG 499</Td>
                  <Td>Wed: 1500-1620</Td>
                  <Td>Summer</Td>
                  <Td>Daniela Damian</Td>
                  <Td>30792</Td>
                  <Td>Wed May 04, 2022 - Fri Jul 29, 2022</Td>
                  <Td>82</Td>
                </Tr>
                <Tr>
                  <Td>SENG 499</Td>
                  <Td>Wed: 1500-1620</Td>
                  <Td>Summer</Td>
                  <Td>Daniela Damian</Td>
                  <Td>30792</Td>
                  <Td>Wed May 04, 2022 - Fri Jul 29, 2022</Td>
                  <Td>82</Td>
                </Tr>
                <Tr>
                  <Td>SENG 499</Td>
                  <Td>Wed: 1500-1620</Td>
                  <Td>Summer</Td>
                  <Td>Daniela Damian</Td>
                  <Td>30792</Td>
                  <Td>Wed May 04, 2022 - Fri Jul 29, 2022</Td>
                  <Td>82</Td>
                </Tr>
                <Tr>
                  <Td>SENG 499</Td>
                  <Td>Wed: 1500-1620</Td>
                  <Td>Summer</Td>
                  <Td>Daniela Damian</Td>
                  <Td>30792</Td>
                  <Td>Wed May 04, 2022 - Fri Jul 29, 2022</Td>
                  <Td>82</Td>
                </Tr>
                <Tr>
                  <Td>SENG 499</Td>
                  <Td>Wed: 1500-1620</Td>
                  <Td>Summer</Td>
                  <Td>Daniela Damian</Td>
                  <Td>30792</Td>
                  <Td>Wed May 04, 2022 - Fri Jul 29, 2022</Td>
                  <Td>82</Td>
                </Tr>
                <Tr>
                  <Td>SENG 499</Td>
                  <Td>Wed: 1500-1620</Td>
                  <Td>Summer</Td>
                  <Td>Daniela Damian</Td>
                  <Td>30792</Td>
                  <Td>Wed May 04, 2022 - Fri Jul 29, 2022</Td>
                  <Td>82</Td>
                </Tr>
                <Tr>
                  <Td>SENG 499</Td>
                  <Td>Wed: 1500-1620</Td>
                  <Td>Summer</Td>
                  <Td>Daniela Damian</Td>
                  <Td>30792</Td>
                  <Td>Wed May 04, 2022 - Fri Jul 29, 2022</Td>
                  <Td>82</Td>
                </Tr>
                <Tr>
                  <Td>SENG 499</Td>
                  <Td>Wed: 1500-1620</Td>
                  <Td>Summer</Td>
                  <Td>Daniela Damian</Td>
                  <Td>30792</Td>
                  <Td>Wed May 04, 2022 - Fri Jul 29, 2022</Td>
                  <Td>82</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Flex>
      </Container>
    </Flex>
  );
};
