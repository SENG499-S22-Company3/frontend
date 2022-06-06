import { EditIcon } from "@chakra-ui/icons";
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
  IconButton,
  FormControl,
  FormLabel,
  Input,
  RadioGroup,
  Stack,
  Radio,
} from "@chakra-ui/react";
import { useState } from "react";

interface UserInfo {
  name: string;
  email: string;
  department: string;
  role: string;
}

export const EditProfile = (details: UserInfo) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState(details.name);
  const [email, setEmail] = useState(details.email);
  const [department, setDepartment] = useState(details.department);
  const [role, setRole] = useState(details.role);

  const onSave = () => {
    console.log(name);
    console.log(email);
    console.log(department);
    onClose();
  };

  return (
    <>
      <IconButton
        colorScheme="green"
        aria-label="Reopen Survey"
        icon={<EditIcon />}
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} size="xl" onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{details.name}</ModalHeader>
          <ModalCloseButton colorScheme="green" />
          <ModalBody>
            <Flex
              p={10}
              borderRadius={10}
              flexDir="column"
              style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.40)" }}
              mb={5}
              backgroundColor="gray.800"
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
                <Button colorScheme="green" mr={3} onClick={onSave}>
                  Save
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
