import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  RadioGroup,
  Stack,
  Radio,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";

export const CreateUser = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");

  const bg = useColorModeValue("gray.50", "gray.800");

  const createUser = () => {
    //Create User here
    onClose();
  };

  return (
    <>
      <Button colorScheme="green" w="150px" mb={5} onClick={onOpen}>
        Create User
      </Button>
      <Modal isOpen={isOpen} size="xl" onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create User</ModalHeader>
          <ModalCloseButton colorScheme="green" />
          <ModalBody>
            <Flex
              p={10}
              borderRadius={10}
              flexDir="column"
              style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.40)" }}
              mb={5}
              backgroundColor={bg}
            >
              <FormControl isRequired>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  mb={5}
                />
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="name"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  mb={5}
                />
                <FormLabel htmlFor="department">Department</FormLabel>
                <RadioGroup
                  id="radio"
                  onChange={setDepartment}
                  value={department}
                  mb={5}
                  colorScheme="green"
                >
                  <Stack direction="row">
                    <Radio value="SENG">SENG</Radio>
                    <Radio value="CSC">CSC</Radio>
                    <Radio value="ECE">ECE</Radio>
                  </Stack>
                </RadioGroup>
                <FormLabel htmlFor="role">User Role</FormLabel>
                <RadioGroup
                  id="radio"
                  onChange={setRole}
                  value={role}
                  mb={5}
                  colorScheme="green"
                >
                  <Stack direction="row">
                    <Radio value="Admin">Admin</Radio>
                    <Radio value="Professor">Professor</Radio>
                  </Stack>
                </RadioGroup>
                <Button colorScheme="green" mr={3} onClick={createUser}>
                  Create
                </Button>
                <Button colorScheme="red" mr={3} onClick={onClose}>
                  Cancel
                </Button>
              </FormControl>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
