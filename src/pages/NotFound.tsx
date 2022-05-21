import { Flex } from "@chakra-ui/react";
import React from "react";

export const NotFound = () => {
  return (
    <Flex
      w="100%"
      minH="calc(100vh - 5.5rem)"
      pt={30}
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      404
    </Flex>
  );
};
