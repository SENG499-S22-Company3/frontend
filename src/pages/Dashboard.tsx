import React from "react";
import { Flex, Heading, Box, Text } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "../components/Card";

export const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <Flex
      w="100%"
      pt={30}
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      mt={64}
    >
      <Heading mb={10}>Admin Dashboard</Heading>
      <Flex mb={32}>
        <Box p="1vw">
          <Link to="/surveyresults">
            <Box
              w="15vw"
              minW="150px"
              p="1vw"
              style={{ boxShadow: "0px 0px 10px" }}
              textAlign="center"
              borderRadius="10px"
            >
              <Text fontWeight="700" pb="10px">
                Survey Results
              </Text>
              View the results of surveys.
            </Box>
          </Link>
        </Box>
        <Box p="1vw">
          <Link to="/schedule">
            <Box
              w="15vw"
              minW="150px"
              p="1vw"
              style={{ boxShadow: "0px 0px 10px" }}
              textAlign="center"
              borderRadius="10px"
            >
              <Text fontWeight="700" pb="10px">
                Schedule
              </Text>
              View class schedules.
            </Box>
          </Link>
        </Box>
        <Box p="1vw">
          <Link to="/generate">
            <Box
              w="15vw"
              minW="150px"
              p="1vw"
              style={{ boxShadow: "0px 0px 10px" }}
              textAlign="center"
              borderRadius="10px"
            >
              <Text fontWeight="700" pb="10px">
                Generate
              </Text>
              Generate a schedule.
            </Box>
          </Link>
        </Box>
        <Box p="1vw">
          <Link to="/profileManagement">
            <Box
              w="15vw"
              minW="150px"
              p="1vw"
              style={{ boxShadow: "0px 0px 10px" }}
              textAlign="center"
              borderRadius="10px"
            >
              <Text fontWeight="700" pb="10px">
                Profile Management
              </Text>
              Manage professor profiles.
            </Box>
          </Link>
        </Box>
      </Flex>
    </Flex>
  );
};
