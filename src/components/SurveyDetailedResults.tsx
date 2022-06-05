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
} from "@chakra-ui/react";

interface ProfessorDetails {
  professor: String;
  preferences: Array<String>;
  nonTeachingTerm1: String;
  nonTeachingTerm2: String;
  relief: String;
  reliefExplanation: String;
  studyLeave: String;
  studyExplanation: String;
  topics: String;
  topicsCourse: String;
  topicDescription: String;
}

export const SurveyDetailedResults = (details: ProfessorDetails) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen} colorScheme='green'>More Details</Button>
      <Modal isOpen={isOpen} size="4xl" onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{details.professor}</ModalHeader>
          <ModalCloseButton colorScheme="green" />
          <ModalBody>
            <Flex
              bg="#212938"
              p={10}
              borderRadius={10}
              flexDir="column"
              style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.40)" }}
            >
              <Table variant="simple" size="md">
                <Thead>
                  <Tr>
                    <Th>Option</Th>
                    <Th>Selection</Th>
                    <Th>Description</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>Relief</Td>
                    <Td>{details.relief}</Td>
                    <Td>{details.reliefExplanation}</Td>
                  </Tr>
                  <Tr>
                    <Td>Study Leave</Td>
                    <Td>{details.studyLeave}</Td>
                    <Td>{details.studyExplanation}</Td>
                  </Tr>
                  <Tr>
                    <Td>Topics/Grad Course</Td>
                    <Td>{details.topics}</Td>
                    <Td>
                      {details.topicsCourse}: {details.topicDescription}
                    </Td>
                  </Tr>
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
  );
};
