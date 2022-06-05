import React from "react";
import { Link } from "react-router-dom";
import { Button, Flex, Text } from "@chakra-ui/react";
export const Generate = () => {
  return (
    <Flex
      w="100%"
      minH="calc(100vh - 5.5rem)"
      pt={30}
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Button
        mt={5}
        w="300px"
        as={Link}
        to="/schedule"
        colorScheme="purple"
        variant="solid"
      >
        Generate Schedule
      </Button>
    </Flex>
  );
};

