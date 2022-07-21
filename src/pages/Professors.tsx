import React, { useEffect, useState } from "react";
import {
  Container,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useToast,
} from "@chakra-ui/react";
import { CreateUser } from "../components/ProfileManagement/CreateUser";
import { SearchBar } from "../components/ProfileManagement/SearchBar";
import { UserInfo } from "../stores/profileManagement";
import { gql, useQuery } from "@apollo/client";
import { PreferenceDetails } from "../components/ProfileManagement/PreferenceDetails";

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
  const { data, loading, error } = useQuery(USERS);
  const [allUsers, setAllUsers] = useState<Array<UserInfo>>([]);
  const [filteredUsers, setFilteredUsers] = useState<Array<UserInfo>>([]);

  const toast = useToast();

  useEffect(() => {
    if (!loading) {
      if (data && !error) {
        if (data.allUsers) {
          const sortedData = data.allUsers
            .slice()
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
            isClosable: true,
          });
          console.log(data);
        }
      } else if (error) {
        toast({
          title: "Failed to get professor info",
          description: error.message,
          status: "error",
          isClosable: true,
        });
        console.log(error);
      }
    }
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
