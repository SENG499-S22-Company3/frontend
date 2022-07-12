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
} from "@chakra-ui/react";
import { CreateUser } from "../components/UserManagement/CreateUser";
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

  useEffect(() => {
    if (!loading) {
      if (data && !error) {
        const sortedData = data.allUsers
          .slice()
          .sort((a: UserInfo, b: UserInfo) => {
            return a.displayName.localeCompare(b.displayName);
          });
        setAllUsers(sortedData);
        setFilteredUsers(sortedData);
      } else if (error) {
        console.log(error);
      }
    }
  }, [data, loading, error]);

  return (
    <Flex
      w="100%"
      minH="calc(100vh - 5.5rem)"
      pt={30}
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Container maxW="container.xl">
        <Heading mb={6}>Professors</Heading>
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
              {filteredUsers ? (
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
                <Text>Failed to fetch users</Text>
              )}
            </Tbody>
          </Table>
        </Flex>
      </Container>
    </Flex>
  );
};
