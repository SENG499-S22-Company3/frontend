import { Flex, Container, Heading, Button, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import notFound from "../404.jpg";
import { useLoginStore } from "../stores/login";
import shallow from "zustand/shallow";

export const NotFound = () => {
  const [user] = useLoginStore(
    (state) => [
      state.user,
    ],
    shallow
  );

  return (
    <Flex
      w="100%"
      minH="calc(100vh - 5.5rem)"
      pt={30}
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Container
        w="30%"
        borderRadius={20}
        p={10}
        style={{ boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.40)" }}
        textAlign="center"
        centerContent
      >
        <Heading size="4xl" mb={2}>
          404
        </Heading>
        <Text fontWeight="500" pb="10px" mb={5}>
          Page not found
        </Text>
        <img src={notFound} alt="logo" />
        <Link to={
            user?.roles.includes("admin") || user?.roles.includes("user")
              ? "/login"
              : "/"
          }>
          <Button
            mt={10}
            type="submit"
            colorScheme="blue"
            variant="solid"
            w="100%"
          >
            Go Home
          </Button>
        </Link>
      </Container>
    </Flex>
  );
};
