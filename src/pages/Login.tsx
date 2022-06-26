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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gql, useMutation /*useQuery*/ } from "@apollo/client";
import { useLoginStore } from "../stores/login";
import shallow from "zustand/shallow";

const LOGIN = gql`
  mutation login($password: String!, $username: String!) {
    login(password: $password, username: $username) {
      message
      success
    }
  }
`;

//This query doesn't appear to be working. Will use once it is working though.
/*
const ME = gql`
  query me {
    me {
      id
      username
      password
      role
      preferences {
        id {
          code
        }
      }
      active
    }
  }
`;
*/

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, { data, loading, error }] = useMutation(LOGIN);

  const [user, loggedIn, persistUser] = useLoginStore(
    (state) => [state.user, state.loggedIn, state.persistUser],
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
  }, [loggedIn, user, navigate]);

  useEffect(() => {
    if (data && !error && !loading) {
      if (
        data.login.success === true ||
        // need the `me` endpoint to handle this case, so this is still blocked
        data.login.message.toLowerCase().includes("already logged in")
      ) {
        // This will go once the ME query is working
        const usr = {
          username: username,
          name: username,
          email: username,
          roles: ["admin"],
          displayName: username,
        };

        if (data.login.message.toLowerCase().includes("already logged in")) {
          console.warn("already logged in warning!");
        }

        persistUser(usr);
      } else {
        console.error(data.login);
      }
    }
  }, [data, error, loading, username, persistUser]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    login({ variables: { username, password } });
    /* This should be used to get the current user info to store. However, the PR isn't merged yet
    const {
      data: meData,
      loading: meLoading,
      error: meError,
    } = useQuery(ME, {});
    if (meData && !meLoading && !meError) {
      if (data.login.success === true) {
        localStorage.setItem('user', JSON.stringify(meData));
      }
    }
    */
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
        <Heading mb={6}>Sign in to Schedulater</Heading>
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
                isLoading={loading}
                type="submit"
                colorScheme="green"
                variant="solid"
                w="100%"
              >
                Sign in
              </Button>
            </FormControl>
            <FormControl isInvalid={error !== undefined}>
              {error !== undefined && (
                <FormErrorMessage mt={5}>{error.message}</FormErrorMessage>
              )}
            </FormControl>
          </form>
        </Flex>
      </Container>
    </Flex>
  );
};
