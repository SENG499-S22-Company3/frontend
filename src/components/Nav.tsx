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
import React, { useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import { useLoginStore } from "../stores/login";
import shallow from "zustand/shallow";

const LOGOUT = gql`
  mutation Logout {
    logout {
      success
      message
    }
  }
`;

const LoginStatus = () => {
  const [user, loggedIn, unPersistUser] = useLoginStore(
    (state) => [state.user, state.loggedIn, state.unPersistUser],
    shallow
  );
  const [logout, { client, data, loading, error }] = useMutation(LOGOUT);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      if (
        data.logout.success ||
        data.logout.message.toLowerCase().includes("not logged in")
      ) {
        toast({
          title: "Successfully logged out",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Reset the store so that the user information isn't cached
        client.resetStore();
        unPersistUser();

        navigate("/");
      } else {
        toast({
          title: "Failed to logged out",
          description: data.logout.message,
          status: "error",
          isClosable: true,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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

  if (loggedIn && user !== undefined) {
    return (
      <Box ml="auto">
        <Menu>
          <MenuButton as={Link}>
            <b>Hello, {user.name}!</b>
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => logout()}>Log out</MenuItem>
          </MenuList>
        </Menu>
      </Box>
    );
  }

  return <BoldNavLink to="/login" desc="Login" mr={0} />;
};

const NavLink = (props: { to: string; desc: string } & LinkProps) => (
  <Link as={ReactRouterLink} mr={4} {...props}>
    <>{props.desc}</>
  </Link>
);

const BoldNavLink = (props: { to: string; desc: string } & LinkProps) => (
  <Link as={ReactRouterLink} mr={4} {...props}>
    <b>{props.desc}</b>
  </Link>
);

export const NavHeader = () => {
  const [user, loggedIn] = useLoginStore(
    (state) => [state.user, state.loggedIn],
    shallow
  );
  const bg = useColorModeValue("gray.100", "gray.700");
  const isSmall = useBreakpointValue({ base: true, xl: false });

  // admin condition is temporarily commented out for testing
  const isAdmin = user && user["roles"] && user["roles"].includes("admin");
  const isUser = user && user["roles"] && user["roles"].includes("user");
  // const isAdmin = true;
  // const isUser = true;

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
                {!loggedIn && (
                  <MenuItem>
                    <NavLink to="/" desc="Home" />
                  </MenuItem>
                )}
                {isAdmin && (
                  <>
                    <MenuDivider />
                    <MenuItem>
                      <NavLink to="/dashboard" desc="Admin Dashboard" />
                    </MenuItem>
                    <MenuItem>
                      <NavLink to="/generate" desc="Generate Schedules" />
                    </MenuItem>
                    <MenuItem>
                      <NavLink
                        to="/profileManagement"
                        desc="Profile Management"
                      />
                    </MenuItem>
                    <MenuItem>
                      <NavLink to="/schedule" desc="View Schedules" />
                    </MenuItem>
                    <MenuItem>
                      <NavLink to="/surveyresults" desc="Survey Results" />
                    </MenuItem>
                  </>
                )}
                {isUser && (
                  <>
                    <MenuDivider />
                    <MenuItem>
                      <NavLink to="/survey" desc="Preferences Survey" />
                    </MenuItem>
                  </>
                )}
              </MenuList>
            </Menu>
          </>
        ) : (
          <>
            {!loggedIn && <BoldNavLink to="/" desc="Home" />}
            {isAdmin && (
              <>
                <BoldNavLink to="/dashboard" desc="Admin Dashboard" />
                <BoldNavLink to="/generate" desc="Generate Schedules" />
                <BoldNavLink
                  to="/profileManagement"
                  desc="Profile Management"
                />
                <BoldNavLink to="/schedule" desc="View Schedules" />
                <BoldNavLink to="/surveyresults" desc="Survey Results" />
              </>
            )}
            {isUser && (
              <>
                <BoldNavLink to="/survey" desc="Preferences Survey" />
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
