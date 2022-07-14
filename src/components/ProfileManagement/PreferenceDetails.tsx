import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Table,
  Tr,
  Td,
  Th,
  Thead,
  Tbody,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { UserInfo } from "../../stores/profileManagement";

export const PreferenceDetails = (details: UserInfo) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bg = useColorModeValue("gray.50", "gray.800");

  return (
    <>
      {details.preferences.length < 1 ? (
        <>No Preferences Set</>
      ) : (
        <>
          <Button onClick={onOpen} colorScheme="green">
            Show Preferences
          </Button>
          <Modal isOpen={isOpen} size="4xl" onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{details.displayName}</ModalHeader>
              <ModalCloseButton colorScheme="green" />
              <ModalBody>
                <Flex
                  bg={bg}
                  p={10}
                  m={10}
                  borderRadius={10}
                  flexDir="column"
                  style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.40)" }}
                >
                  <Table variant="striped" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Course</Th>
                        <Th>Preference</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {details.preferences.map((preference) => (
                        <Tr
                          key={preference.id.subject + " " + preference.id.code}
                        >
                          <Td>
                            {preference.id.subject + " " + preference.id.code}
                          </Td>
                          <Td>{preference.preference}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Flex>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </>
  );
};
