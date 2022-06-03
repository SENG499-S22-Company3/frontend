import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Textarea,
  Tooltip,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { useLoginStore } from "../stores/login";

// these schemas will probably change later, all just example data
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
      // TODO: this route will change to whatever the default page is once the
      // user is logged in
      navigate("/");
    }
  }, [data, error, loading, navigate]);

  const css = `
    table {
      width: 100%;
      height: 100%;
    }
    th {
      border: 1px solid  #2d3436;
      font-weight: 300;
    }
    .bold{
      font-weight: bold;
      border-bottom: 2px solid  #dfe6e9;
    }
    .scroll{
      border: 2px solid  #dfe6e9;
      overflow-y:auto;
      max-height:50vh;
    }
  `
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
        <Button
        mt={5}
        w="300px"
        as={Link}
        to="/schedule"
        
        backgroundColor="#8e44ad"
        colorScheme="purple"
        textColor="#ffffff"
        variant="solid"
        float={`right`}
      >
        Generate New Schedule
      </Button>
        <Select
          id="select"
          w="160px"
          value={selectValue}
          mb={5}
          onChange={(e) => setSelectValue(e.target.value)}
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
         <div className={`scroll`}>
            <style>
                {css}
            </style>
            <table>
              
              <tr>
                <th className={`bold`}>Course</th>
                <th className={`bold`}>Schedule Time</th>
                <th className={`bold`}>Term</th>
                <th className={`bold`}>Prof/Instructor</th>
                <th className={`bold`}>CRN</th>
                <th className={`bold`}>Start/End Date</th>
                <th className={`bold`}>Students</th>
              </tr>
              
              <tr >
                <th>SENG 499</th>
                <th>Wed: 1500-1620</th>
                <th>Summer</th>
                <th>Daniela Damian</th>
                <th>30792</th>
                <th>Wed May 04, 2022 - Fri Jul 29, 2022</th>
                <th>82</th>
              </tr>
              <tr >
                <th>SENG 499</th>
                <th>Wed: 1500-1620</th>
                <th>Summer</th>
                <th>Daniela Damian</th>
                <th>30792</th>
                <th>Wed May 04, 2022 - Fri Jul 29, 2022</th>
                <th>82</th>
              </tr>
              <tr >
                <th>SENG 499</th>
                <th>Wed: 1500-1620</th>
                <th>Summer</th>
                <th>Daniela Damian</th>
                <th>30792</th>
                <th>Wed May 04, 2022 - Fri Jul 29, 2022</th>
                <th>82</th>
              </tr>
              <tr >
                <th>SENG 499</th>
                <th>Wed: 1500-1620</th>
                <th>Summer</th>
                <th>Daniela Damian</th>
                <th>30792</th>
                <th>Wed May 04, 2022 - Fri Jul 29, 2022</th>
                <th>82</th>
              </tr>
              <tr >
                <th>SENG 499</th>
                <th>Wed: 1500-1620</th>
                <th>Summer</th>
                <th>Daniela Damian</th>
                <th>30792</th>
                <th>Wed May 04, 2022 - Fri Jul 29, 2022</th>
                <th>82</th>
              </tr>
              <tr >
                <th>SENG 499</th>
                <th>Wed: 1500-1620</th>
                <th>Summer</th>
                <th>Daniela Damian</th>
                <th>30792</th>
                <th>Wed May 04, 2022 - Fri Jul 29, 2022</th>
                <th>82</th>
              </tr>
              <tr >
                <th>SENG 499</th>
                <th>Wed: 1500-1620</th>
                <th>Summer</th>
                <th>Daniela Damian</th>
                <th>30792</th>
                <th>Wed May 04, 2022 - Fri Jul 29, 2022</th>
                <th>82</th>
              </tr>
              <tr >
                <th>SENG 499</th>
                <th>Wed: 1500-1620</th>
                <th>Summer</th>
                <th>Daniela Damian</th>
                <th>30792</th>
                <th>Wed May 04, 2022 - Fri Jul 29, 2022</th>
                <th>82</th>
              </tr>
              <tr >
                <th>SENG 499</th>
                <th>Wed: 1500-1620</th>
                <th>Summer</th>
                <th>Daniela Damian</th>
                <th>30792</th>
                <th>Wed May 04, 2022 - Fri Jul 29, 2022</th>
                <th>82</th>
              </tr>
              <tr >
                <th>SENG 499</th>
                <th>Wed: 1500-1620</th>
                <th>Summer</th>
                <th>Daniela Damian</th>
                <th>30792</th>
                <th>Wed May 04, 2022 - Fri Jul 29, 2022</th>
                <th>82</th>
              </tr>
              <tr >
                <th>SENG 499</th>
                <th>Wed: 1500-1620</th>
                <th>Summer</th>
                <th>Daniela Damian</th>
                <th>30792</th>
                <th>Wed May 04, 2022 - Fri Jul 29, 2022</th>
                <th>82</th>
              </tr>
              <tr >
                <th>SENG 499</th>
                <th>Wed: 1500-1620</th>
                <th>Summer</th>
                <th>Daniela Damian</th>
                <th>30792</th>
                <th>Wed May 04, 2022 - Fri Jul 29, 2022</th>
                <th>82</th>
              </tr>
              <tr >
                <th>SENG 499</th>
                <th>Wed: 1500-1620</th>
                <th>Summer</th>
                <th>Daniela Damian</th>
                <th>30792</th>
                <th>Wed May 04, 2022 - Fri Jul 29, 2022</th>
                <th>82</th>
              </tr>
              <tr >
                <th>SENG 499</th>
                <th>Wed: 1500-1620</th>
                <th>Summer</th>
                <th>Daniela Damian</th>
                <th>30792</th>
                <th>Wed May 04, 2022 - Fri Jul 29, 2022</th>
                <th>82</th>
              </tr>
              <tr >
                <th>SENG 499</th>
                <th>Wed: 1500-1620</th>
                <th>Summer</th>
                <th>Daniela Damian</th>
                <th>30792</th>
                <th>Wed May 04, 2022 - Fri Jul 29, 2022</th>
                <th>82</th>
              </tr>
              <tr >
                <th>SENG 499</th>
                <th>Wed: 1500-1620</th>
                <th>Summer</th>
                <th>Daniela Damian</th>
                <th>30792</th>
                <th>Wed May 04, 2022 - Fri Jul 29, 2022</th>
                <th>82</th>
              </tr>
              <tr >
                <th>SENG 499</th>
                <th>Wed: 1500-1620</th>
                <th>Summer</th>
                <th>Daniela Damian</th>
                <th>30792</th>
                <th>Wed May 04, 2022 - Fri Jul 29, 2022</th>
                <th>82</th>
              </tr>
              <tr >
                <th>SENG 499</th>
                <th>Wed: 1500-1620</th>
                <th>Summer</th>
                <th>Daniela Damian</th>
                <th>30792</th>
                <th>Wed May 04, 2022 - Fri Jul 29, 2022</th>
                <th>82</th>
              </tr>
              <tr >
                <th>SENG 499</th>
                <th>Wed: 1500-1620</th>
                <th>Summer</th>
                <th>Daniela Damian</th>
                <th>30792</th>
                <th>Wed May 04, 2022 - Fri Jul 29, 2022</th>
                <th>82</th>
              </tr>
              <tr >
                <th>SENG 499</th>
                <th>Wed: 1500-1620</th>
                <th>Summer</th>
                <th>Daniela Damian</th>
                <th>30792</th>
                <th>Wed May 04, 2022 - Fri Jul 29, 2022</th>
                <th>82</th>
              </tr>
            </table> 
          </div> 
        </Flex>
      </Container>
    </Flex>
  );
};
