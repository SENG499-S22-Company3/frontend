import { useLoginStore } from "../stores/login";
import shallow from "zustand/shallow";
import {
  Container,
  Flex,
  Heading,
  Table,
  Tbody,
  Tr,
  Td,
} from "@chakra-ui/react";
import { ChangePassword } from "../components/Profile/ChangePassword";

export const Profile = () => {
  const [user] = useLoginStore((state) => [state.user], shallow);

  return (
    <Flex
      w="100%"
      minH="calc(100vh - 5.5rem)"
      pt={30}
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      
      <Heading mb={10}>My Profile</Heading>
      <Container
        w="500px"
        borderRadius={20}
        p={10}
        style={{ boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.40)" }}
        textAlign="center"
        centerContent
      >
        <Table variant="striped" size="lg">
          <Tbody>
            <Tr key="username">
              <Td color="gray">Username:</Td>
              <Td>{user?.username}</Td>
            </Tr>
            <Tr key="name">
              <Td color="gray">Name:</Td>
              <Td>{user?.name}</Td>
            </Tr>
            <Tr key="displayname">
              <Td color="gray">Display Name:</Td>
              <Td>{user?.displayName}</Td>
            </Tr>
            <Tr key="email">
              <Td color="gray">Email:</Td>
              <Td>{user?.email}</Td>
            </Tr>
            <Tr key="roles">
              <Td color="gray">Role:</Td>
              <Td>{user?.roles}</Td>
            </Tr>
            <Tr key="password">
              <Td color="gray">Password:</Td>
              <Td>**********</Td>
            </Tr>
          </Tbody>
        </Table>
        <ChangePassword />
      </Container>
    </Flex>
  );
};
