import {
  Box,
  Flex,
  IconButton,
  Image,
  Link,
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

import { gql, useMutation } from "@apollo/client";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useEffect } from "react";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import { LoginStore, useLoginStore } from "../stores/login";

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
  const loginState = useLoginStore();
  const bg = useColorModeValue("gray.100", "gray.700");
  const isSmall = useBreakpointValue({ base: true, xl: false });

  // admin condition is temporarily commented out for testing
  // const isAdmin = loginState.user && loginState.user.roles.includes("admin");
  const isAdmin = true;

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
                  <NavLink to="/" desc="Home" bold={false} />
                </MenuItem>
                <MenuItem>
                  <NavLink
                    to="/profileManagement"
                    desc="Profile Management"
                    bold={false}
                  />
                </MenuItem>
                <MenuItem>
                  <NavLink to="/schedule" desc="View Schedules" bold={false} />
                </MenuItem>
                <MenuItem>
                  <NavLink
                    to="/survey"
                    desc="Preferences Survey"
                    bold={false}
                  />
                </MenuItem>
                <MenuItem>
                  <NavLink
                    to="/surveyresults"
                    desc="Survey Results"
                    bold={false}
                  />
                </MenuItem>
                {isAdmin && (
                  <>
                    <MenuDivider />
                    <MenuItem>
                      <NavLink
                        to="/dashboard"
                        desc="Admin Dashboard"
                        bold={false}
                      />
                    </MenuItem>
                    <MenuItem>
                      <NavLink
                        to="/generate"
                        desc="Generate Schedules"
                        bold={false}
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
            <NavLink to="/profileManagement" desc="Profile Management" />
            <NavLink to="/schedule" desc="View Schedules" />
            <NavLink to="/survey" desc="Preferences Survey" />
            <NavLink to="/surveyresults" desc="Survey Results" />
            {isAdmin && (
              <>
                <NavLink to="/dashboard" desc="Admin Dashboard" />
                <NavLink to="/generate" desc="Generate Schedules" />
              </>
            )}
          </>
        )}
      </Flex>
      <Flex alignItems="center">
        <LoginStatus loginState={loginState} />
        <ColorModeSwitcher />
      </Flex>
    </Flex>
  );
};
