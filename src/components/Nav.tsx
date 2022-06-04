import {
  Flex,
  Text,
  Link,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { useLoginStore, LoginStore } from "../stores/login";
import { gql, useMutation } from "@apollo/client";

const LOGOUT = gql`
  mutation Logout {
    logout {
      success
    }
  }
`;

const LoginStatus = (props: { loginState: LoginStore }) => {
  const { loginState } = props;
  const [logout, { data, loading, error }] = useMutation(LOGOUT);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (data && data.Logout.success) {
      toast({
        title: "Successfully logged out",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
    }
  }, [data, toast, navigate]);

  useEffect(() => {
    if (error) {
      toast({
        title: `Error: failed to logout: ${error.message}`,
        status: "error",
        isClosable: true,
      });
    }
  }, [error, toast, navigate]);

  if (loading) {
    return <Spinner size="lg" />;
  }

  if (loginState.loggedIn && loginState.user !== undefined) {
    return (
      <Box ml="auto">
        <Menu>
          <MenuButton as={Link}>
            <b>Hello, {loginState.user.name}!</b>
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => logout()}>Sign out</MenuItem>
          </MenuList>
        </Menu>
      </Box>
    );
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
      bg="gray.700"
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
