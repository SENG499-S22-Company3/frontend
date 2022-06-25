import { Flex, Text, Image, Box, useColorModeValue } from "@chakra-ui/react";

export const Footer = () => {
  const bg = useColorModeValue("gray.100", "gray.700");

  return (
    <Flex
      w="100vw"
      h="40px"
      position="fixed"
      bottom="0px"
      bg={bg}
      alignItems="center"
      justifyContent="space-between"
      px={5}
    >
      <Box h="40px" objectFit="contain">
        <Image
          src={`${process.env.PUBLIC_URL}/uviclogo.svg`}
          alt="uvic logo"
          padding="5px"
          h="40px"
          minWidth="40px"
        ></Image>
      </Box>
      <Text color="gray">
        Made by SENG 499 students in Company 3 at the University of Victoria
        during summer 2022.
      </Text>
      <a href="https://github.com/SENG499-S22-Company3">
        <b title="View Source Code on GitHub">View code on GitHub</b>
      </a>
    </Flex>
  );
};