import { Flex, Text, Link } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import React from "react";
import { useLoginStore, LoginStore } from "../stores/login";

const LoginStatus = (props: { loginState: LoginStore }) => {
  const { loginState } = props;
  if (loginState.loggedIn && loginState.user !== undefined) {
    return <Flex>Hello {loginState.user.name}</Flex>;
  }
  return <NavLink to="/login" desc="Login" />;
};

const NavLink = (props: { to: string; desc: string }) => (
  <Link as={ReactRouterLink} to={props.to} mr={4}>
    <b>{props.desc}</b>
  </Link>
);

export const NavHeader = () => {
  const loginState = useLoginStore();

  return (
    <Flex
      w="100vw"
      h="50px"
      bg="#232b3b"
      alignItems="center"
      justifyContent="space-between"
      px={3}
    >
      <Flex>
        {/* TODO: Eventually this will be replaced with a logo or something nicer */}
        <Text mr={4}>
          <b>SchedulaterLogoHere</b>
        </Text>
        <NavLink to="/" desc="Home" />
        {loginState.user && loginState.user.roles.includes("admin") && (
          <>
            <NavLink to="/dashboard" desc="Admin Dashboard" />
            <NavLink to="/generate" desc="Generate Schedules" />
          </>
        )}
        <NavLink to="/schedule" desc="View Schedules" />
        <NavLink to="/profileManagement" desc="Profile Management" />
        {/* TODO: Still need to create a page and route for actually doing the survey */}
        <NavLink to="/survey" desc="Preferences Survey" />
        <NavLink to="/surveyresults" desc="Survey Results" />
      </Flex>
      <LoginStatus loginState={loginState} />
    </Flex>
  );
};
