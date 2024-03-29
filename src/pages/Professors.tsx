import { gql, useQuery } from "@apollo/client";
import {
  Container,
  Flex,
  Heading,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { CreateUser } from "../components/ProfileManagement/CreateUser";
import { PreferenceDetails } from "../components/ProfileManagement/PreferenceDetails";
import { SearchBar } from "../components/ProfileManagement/SearchBar";
import { Preference, UserInfo } from "../stores/profileManagement";

const USERS = gql`
  query getUsers {
    allUsers {
      username
      displayName
      role
      preferences {
        id {
          subject
          code
          term
        }
        preference
      }
    }
  }
`;

export const Professors = () => {
  const { data, loading, error } = useQuery(USERS, {
    fetchPolicy: "no-cache",
  });
  const [allUsers, setAllUsers] = useState<Array<UserInfo>>([]);
  const [filteredUsers, setFilteredUsers] = useState<Array<UserInfo>>([]);

  const toast = useToast();

  useEffect(() => {
    if (!loading) {
      if (data && !error) {
        if (data.allUsers) {
          const sortedData = data.allUsers
            .map((user: UserInfo) => ({
              ...user,
              preferences: user.preferences.sort(
                (a: Preference, b: Preference) => {
                  return b.preference - a.preference;
                }
              ),
            }))
            .sort((a: UserInfo, b: UserInfo) => {
              if (a.displayName && b.displayName) {
                return a.displayName.localeCompare(b.displayName);
              } else return 0;
            });
          setAllUsers(sortedData);
          setFilteredUsers(sortedData);
        } else {
          toast({
            title: "Failed to get professor info",
            status: "error",
            duration: null,
            isClosable: true,
          });
          console.log(data);
        }
      } else if (error) {
        toast({
          title: "Failed to get professor info",
          description: error.message,
          status: "error",
          duration: null,
          isClosable: true,
        });
        console.log(error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, loading, error]);

  return (
    <Flex
      w="100%"
      minH="calc(100vh - 5.5rem)"
      pt={50}
      alignItems="center"
      flexDirection="column"
    >
      <Heading mb={10}>Professors</Heading>
      <Container maxW="container.xl">
        <Flex
          p={10}
          borderRadius={10}
          flexDir="column"
          style={{ boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.40)" }}
        >
          <CreateUser />
          <SearchBar
            professors={filteredUsers}
            setProfessors={setFilteredUsers}
            allProfessors={allUsers}
          />
          <Text mt={3}>
            "No Preferences Set" means that a professor has not filled out the
            preference survey.
          </Text>
          <Text mb={3}>
            On schedule generation they will be given a default preference of 3
            (With Effort & Willing) on all courses
          </Text>
          <Table variant="striped" size="md">
            <Thead>
              <Tr>
                <Th>Professor</Th>
                <Th>Username</Th>
                <Th>User Role</Th>
                <Th># of Preferences Set</Th>
                <Th>Preferences</Th>
              </Tr>
            </Thead>
            <Tbody>
              {loading ? (
                <Tr>
                  <Td>Loading</Td>
                </Tr>
              ) : filteredUsers ? (
                filteredUsers.map((user) => (
                  <Tr key={user.username}>
                    <Td>{user.displayName}</Td>
                    <Td>{user.username}</Td>
                    <Td>{user.role}</Td>
                    <Td>{user.preferences.length}</Td>
                    <Td>
                      <PreferenceDetails {...user} />
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td>Failed to fetch users</Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Flex>
      </Container>
    </Flex>
  );
};
