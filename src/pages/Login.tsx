import { gql, useLazyQuery, useMutation } from "@apollo/client";
import {
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import shallow from "zustand/shallow";
import { useLoginStore } from "../stores/login";

const LOGIN = gql`
  mutation login($password: String!, $username: String!) {
    login(password: $password, username: $username) {
      message
      success
    }
  }
`;

const ME = gql`
  query me {
    me {
      id
      username
      role
    }
  }
`;

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [login, { data: loginData, loading: loginLoading, error: loginError }] =
    useMutation(LOGIN);
  const [fetchMeData, { data: meData, loading: meLoading, error: meError }] =
    // use network-only fetch policy so user info isn't cached between logins/logouts
    useLazyQuery(ME, { fetchPolicy: "network-only" });

  const toast = useToast();

  const [user, loggedIn, persistUser, persistToken] = useLoginStore(
    (state) => [
      state.user,
      state.loggedIn,
      state.persistUser,
      state.persistToken,
    ],
    shallow
  );

  const bg = useColorModeValue("gray.50", "gray.700");
  const navigate = useNavigate();

  // Navigate away to the right page once the user logs in
  // (or if they are already logged in when they navigate to this page)
  useEffect(() => {
    if (loggedIn && user !== undefined) {
      user.roles.includes("admin")
        ? navigate("/dashboard")
        : navigate("/survey");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn, user]);

  // Store the user's information once the `me` query resolves
  useEffect(() => {
    if (!meLoading) {
      if (meData && !meError) {
        const usr = {
          username: meData.me.username,
          roles: [meData.me.role.toLowerCase()],
          // None of these three fields are part of the schema yet
          displayName: meData.me.username,
          name: meData.me.username,
          email: "test@uvic.ca",
        };

        persistUser(usr);
      } else if (meError) {
        console.error(meError);
        toast({
          title: "Failed to fetch user data",
          description: meError.message,
          status: "error",
          isClosable: true,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meData, meError, meLoading]);

  // Fetch the user's data once the `login` query resolves
  useEffect(() => {
    if (!loginLoading) {
      if (loginData && !loginError) {
        if (
          loginData.login.success ||
          loginData.login.message.toLowerCase().includes("already logged in")
        ) {
          persistToken(loginData.login.token);
          fetchMeData();
        } else {
          console.error(loginData.login);
          toast({
            title: "Failed to login",
            description: loginData.login.message,
            status: "error",
            isClosable: true,
          });
        }
      } else if (loginError) {
        toast({
          title: "Failed to login",
          description: loginError.message,
          status: "error",
          isClosable: true,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginData, loginError, loginLoading]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    login({ variables: { username, password } });
    e.preventDefault();
  };

  return (
    <Flex
      w="100%"
      minH="calc(100vh - 5.5rem)"
      pt={30}
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Container mb={32}>
        <Heading mb={6}>Log in to Schedulater</Heading>
        <Flex
          bg={bg}
          p={10}
          borderRadius={10}
          flexDir="column"
          style={{ boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.40)" }}
        >
          <form onSubmit={onSubmit}>
            <FormControl isRequired>
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                mb={5}
              />
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                mb={5}
              />
              <Button
                isLoading={loginLoading}
                type="submit"
                colorScheme="green"
                variant="solid"
                w="100%"
              >
                Log in
              </Button>
            </FormControl>
            <FormControl isInvalid={loginError !== undefined}>
              {loginError !== undefined && (
                <FormErrorMessage mt={5}>{loginError.message}</FormErrorMessage>
              )}
            </FormControl>
          </form>
        </Flex>
      </Container>
    </Flex>
  );
};
