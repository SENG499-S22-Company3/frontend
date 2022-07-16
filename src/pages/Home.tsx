import { Button, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import React from "react";

export const Home = () => {
  return (
    <Flex
      w="100%"
      minH="calc(100vh - 5.5rem)"
      pt={30}
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Text fontSize="6xl">Welcome to Schedulater</Text>
      {/* <Text fontSize="xl">We should probably update this page later</Text> */}
      <Button
        mt={5}
        w="300px"
        as={Link}
        to="/login"
        colorScheme="blue"
        variant="solid"
      >
        Log in
      </Button>
    </Flex>
  );
};
