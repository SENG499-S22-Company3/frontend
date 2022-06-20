import {
    Flex,
    Text,
    Image,
    Box,
    useColorModeValue,
  } from "@chakra-ui/react";

  import { useLoginStore, LoginStore } from "../stores/login";
  import { gql, useMutation } from "@apollo/client";
  
  const LOGOUT = gql`
    mutation Logout {
      logout {
        success
      }
    }
  `;
  
  export const Footer = () => {
    const loginState = useLoginStore();
    const bg = useColorModeValue("gray.100", "gray.700");
  
    return (
      <Flex
        w="100vw"
        h="20px"
        position="fixed"
        bottom= "0px"
        bg={bg}
        alignItems="center"
        justifyContent="space-between"
        px={3}
      >
        <Box mr="15px" h="60px" objectFit="contain" >
          <Image
            src={`${process.env.PUBLIC_URL}/uviclogo.svg`}
            alt="uvic logo"
            h="40px"
            minWidth="40px"
          >
          </Image>
        </Box>
        <Text>
            Made by SENG 490 students in Company 3 at the University of Victoria during summer 2022. <a href="https://github.com/SENG499-S22-Company3"><b title="View Source Code on GitHub">GitHub</b></a>
        </Text>
        
      </Flex>
    );
  };