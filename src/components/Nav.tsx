import {
  Flex,
  Text,
  Link,
  Image,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spinner,
  useToast,
  LinkProps,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { useLoginStore, LoginStore } from "../stores/login";
import { gql, useMutation } from "@apollo/client";
import { ColorModeSwitcher } from "../ColorModeSwitcher";

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

const NavLink = (props: { to: string; desc: string } & LinkProps) => (
  <Link as={ReactRouterLink} mr={4} {...props}>
    <b>{props.desc}</b>
  </Link>
);

export const NavHeader = () => {
  const loginState = useLoginStore();
  const bg = useColorModeValue("gray.100", "gray.700");

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
        {/*logo box*/}

        <Box
          mr="15px"        
          bg="green.200"
          h="40px"
          w="40px"
          borderRadius="50%"
        >
          <Image 
            src="/logo.png" 
            alt="schedulator logo" 
            minWidth="40px"
            padding="5px" 
          >
          </Image>
        </Box>

        
        <NavLink to="/" desc="Home"/>
        {/* admin condition is temporarily commented out for testing */}
        {
          /* loginState.user && loginState.user.roles.includes("admin") */ true && (
            <>
              <NavLink to="/dashboard" desc="Admin Dashboard" />
              <NavLink to="/generate" desc="Generate Schedules" />
            </>
          )
        }
        <NavLink to="/profileManagement" desc="Profile Management" />
        <NavLink to="/schedule" desc="View Schedules" />
        <NavLink to="/survey" desc="Preferences Survey" />
        <NavLink to="/surveyresults" desc="Survey Results" />
      </Flex>
      <Flex alignItems="center">
        <LoginStatus loginState={loginState} />
        <ColorModeSwitcher />
      </Flex>
    </Flex>
  );
};
