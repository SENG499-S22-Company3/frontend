import React from "react";
import { Flex, HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/Card";

export const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <Flex
      w="100%"
      minH="calc(100vh - 5.5rem)"
      pt={30}
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      mb={32}
    >
      <Flex mb={32}>
        <HStack spacing="24px" alignItems="center" justifyContent="center">
          <Card
            title="Survey Results"
            description="View the results of the surveys that professors have submitted"
            navigateTo="/surveyresults"
          />
          <Card
            title="Schedule"
            description="View class schedules"
            navigateTo="/schedule"
          />
          <Card
            title="Generate"
            description="Generate a schedule"
            navigateTo="/generate"
          />
          <Card
            title="Profile Management"
            description="Manage profiles of different professors"
            navigateTo="/profileManagement"
          />
        </HStack>
      </Flex>
    </Flex>
  );
};
