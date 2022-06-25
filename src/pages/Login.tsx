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

const LOGIN = gql`
  mutation login($password: String!, $username: String!) {
    login(password: $password, username: $username) {
      message
      success
      token
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
  const bg = useColorModeValue("gray.50", "gray.700");
  const navigate = useNavigate();

  useEffect(() => {
    if (data && !error && !loading) {
      if (data.login.success === true) {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("token", data.login.token);
        // This will go once the ME query is working
        const user = {
          username: username,
          name: username,
          email: username,
          roles: ["admin"],
          displayName: username,
        };
        localStorage.setItem("user", JSON.stringify(user));
        user.roles.includes("admin")
          ? navigate("/dashboard")
          : navigate("/survey");
      }
    }
  }, [data, error, loading, navigate, username]);

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
