import {
  Flex,
  Link,
  Box,
  IconButton,
  Image,
  LinkProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  useBreakpointValue,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { ColorModeSwitcher } from "../ColorModeSwitcher";

const LOGOUT = gql`
  mutation Logout {
    logout {
      success
    }
  }
`;

const LoginStatus = () => {
  const [loginState, setLoginState] = useState(
    JSON.parse(localStorage.getItem("loggedIn") || '{ "loggedIn": "false" }')
  );
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || '{ "user": "" }')
  );
  const [logout, { data, loading, error }] = useMutation(LOGOUT);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user") || '{ "user": "" }'));
    setLoginState(
      JSON.parse(localStorage.getItem("loggedIn") || '{ "loggedIn": "false" }')
    );
  }, [navigate]);

  useEffect(() => {
    if (data && data.logout.success) {
      toast({
        title: "Successfully logged out",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      localStorage.setItem("token", "");
      localStorage.setItem("user", "");
      localStorage.setItem("loggedIn", "false");
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, toast]);

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

  if (loginState && user !== "") {
    return (
      <Box ml="auto">
        <Menu>
          <MenuButton as={Link}>
            <b>Hello, {user.name}!</b>
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => logout()}>Sign out</MenuItem>
          </MenuList>
        </Menu>
      </Box>
    );
  }

  return <NavLink to="/login" desc="Login" mr={0} />;
};

const NavLink = (
  props: { to: string; desc: string; bold?: boolean } & LinkProps
) => (
  <Link as={ReactRouterLink} mr={4} {...props}>
    {props.bold === undefined || props.bold === true ? (
      <b>{props.desc}</b>
    ) : (
      <>{props.desc}</>
    )}
  </Link>
);

export const NavHeader = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || '{ "user": "" }')
  );
  const navigate = useNavigate();
  const bg = useColorModeValue("gray.100", "gray.700");
  const isSmall = useBreakpointValue({ base: true, xl: false });

  // admin condition is temporarily commented out for testing
  // const isAdmin = user && user["roles"] && user["roles"].includes("admin");
  // const isUser = user && user["roles"] && user["roles"].includes("user");
  const isAdmin = true;
  const isUser = true;

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user") || '{ "user": "" }'));
  }, [navigate]);

  return (
    <Flex
      w="100vw"
      h="50px"
      bg={bg}
      alignItems="center"
      justifyContent="space-between"
      px={3}
    >
      <Flex alignItems="center">
        <Box mr="15px" bg="green.200" h="40px" w="40px" borderRadius="50%">
          <Image
            src={`${process.env.PUBLIC_URL}/logo.png`}
            alt="schedulator logo"
            minWidth="40px"
            padding="5px"
          ></Image>
        </Box>
        {isSmall ? (
          <>
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<HamburgerIcon />}
                variant="outline"
              />
              <MenuList>
                <MenuItem>
                  <NavLink bold={false} to="/" desc="Home" />
                </MenuItem>
                {isAdmin && (
                  <>
                    <MenuDivider />
                    <MenuItem>
                      <NavLink
                        bold={false}
                        to="/dashboard"
                        desc="Admin Dashboard"
                      />
                    </MenuItem>
                    <MenuItem>
                      <NavLink
                        bold={false}
                        to="/generate"
                        desc="Generate Schedules"
                      />
                    </MenuItem>
                    <MenuItem>
                      <NavLink
                        bold={false}
                        to="/profileManagement"
                        desc="Profile Management"
                      />
                    </MenuItem>
                    <MenuItem>
                      <NavLink
                        bold={false}
                        to="/schedule"
                        desc="View Schedules"
                      />
                    </MenuItem>
                    <MenuItem>
                      <NavLink
                        bold={false}
                        to="/surveyresults"
                        desc="Survey Results"
                      />
                    </MenuItem>
                  </>
                )}
                {isUser && (
                  <>
                    <MenuDivider />
                    <MenuItem>
                      <NavLink
                        bold={false}
                        to="/survey"
                        desc="Preferences Survey"
                      />
                    </MenuItem>
                  </>
                )}
              </MenuList>
            </Menu>
          </>
        ) : (
          <>
            <NavLink to="/" desc="Home" />
            {isAdmin && (
              <>
                <NavLink to="/dashboard" desc="Admin Dashboard" />
                <NavLink to="/generate" desc="Generate Schedules" />
                <NavLink to="/profileManagement" desc="Profile Management" />
                <NavLink to="/schedule" desc="View Schedules" />
                <NavLink to="/surveyresults" desc="Survey Results" />
              </>
            )}
            {isUser && (
              <>
                <NavLink to="/survey" desc="Preferences Survey" />
              </>
            )}
          </>
        )}
      </Flex>
      <Flex alignItems="center">
        <LoginStatus />
        <ColorModeSwitcher />
      </Flex>
    </Flex>
  );
};
