import React from "react";
import { Flex, Heading, Box, Text } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "../components/Card";

export const Dashboard = () => {
  return (
    <Flex
      w="100%"
      pt={30}
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      mt={30}
    >
      <Heading mb={40}>Admin Dashboard</Heading>
      <Flex mb={32}>
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
          <Link to="/professors">
            <Box
              w="15vw"
              minW="150px"
              p="1vw"
              style={{ boxShadow: "0px 0px 10px" }}
              textAlign="center"
              borderRadius="10px"
            >
              <Text fontWeight="700" pb="10px">
                Professors
              </Text>
              View professors.
            </Box>
          </Link>
        </Box>
      </Flex>
    </Flex>
  );
};
