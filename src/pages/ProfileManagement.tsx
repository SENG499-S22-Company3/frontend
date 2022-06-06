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
} from "@chakra-ui/react";
import { EditProfile } from "../components/EditProfile";

export const ProfileManagement = () => {
  //Test data to remove later
  const tableData = [
    {
      name: "Professor A",
      email: "professorA@uvic.ca",
      department: "SENG",
      role: "Admin",
    },
    {
      name: "Professor B",
      email: "professorB@uvic.ca",
      department: "ECE",
      role: "Professor",
    },
    {
      name: "Professor C",
      email: "professorC@uvic.ca",
      department: "SENG",
      role: "Professor",
    },
  ];

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
        <Heading mb={6}>Profile Management</Heading>
        <Flex
          p={10}
          borderRadius={10}
          flexDir="column"
          style={{ boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.40)" }}
        >
          <Table variant="striped" size="md">
            <Thead>
              <Tr>
                <Th>Professor</Th>
                <Th>Email</Th>
                <Th>Department</Th>
                <Th>User Role</Th>
                <Td>Edit</Td>
              </Tr>
            </Thead>
            <Tbody>
              {tableData.map((item) => (
                <Tr key={item.name}>
                  <Td>{item.name}</Td>
                  <Td>{item.email}</Td>
                  <Td>{item.department}</Td>
                  <Td>{item.role}</Td>
                  <Td>
                    <EditProfile {...item} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Flex>
      </Container>
    </Flex>
  );
};
