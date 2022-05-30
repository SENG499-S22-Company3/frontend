import { Flex, Text, Link } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import React from "react";
import { useLoginStore } from "../stores/login";

const LoginStatus = () => {
  const loginState = useLoginStore();
  if (loginState.loggedIn && loginState.user !== undefined) {
    return <Flex>Hello {loginState.user.name}</Flex>;
  }
  return (
    <Link as={ReactRouterLink} to="/login">
      Login
    </Link>
  );
};

export const NavHeader = (props: {}) => {
  return (
    <Flex
      w="100vw"
      h="50px"
      bg="#111"
      alignItems="center"
      justifyContent="space-between"
      px={3}
    >
      <Flex>
        <Text mr={3}>
          <b>Schedulater</b>
        </Text>
        <Link mr={2}>Home</Link>
        <Link mr={2}>Admin</Link>
        <Link mr={2}>Schedules</Link>
        <Link mr={2}>Calendar</Link>
        <Link mr={2}>Survey Results</Link>
      </Flex>
      <LoginStatus />
    </Flex>
  );
};
