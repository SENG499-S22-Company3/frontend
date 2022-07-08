import { gql, useMutation } from "@apollo/client";
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
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

const CREATE = gql`
  mutation create($username: String!) {
    createUser(username: $username) {
      success
      message
      username
      password
    }
  }
`;

export const CreateUser = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [username, setUsername] = useState("");
  // const [email, setEmail] = useState("");
  // const [department, setDepartment] = useState("");
  // const [role, setRole] = useState("");
  const [createUserMutation, { loading, data, error }] = useMutation(CREATE);

  const bg = useColorModeValue("gray.50", "gray.800");

  const createUser = () => {
    createUserMutation({ variables: { username } });
    //Create User here
    onClose();
  };

  const toast = useToast();

  useEffect(() => {
    if (!loading) {
      if (!error && data) {
        if (data.createUser.success) {
          toast({
            title: "User creation successful",
            description: data.createUser.message,
            status: "success",
            isClosable: true,
          });
        } else {
          console.log(data);
          toast({
            title: "Failed to create user",
            description: data.createUser.message,
            status: "error",
            isClosable: true,
          });
        }
      } else if (error) {
        console.log(error);
        toast({
          title: "Failed to create user",
          description: error?.message,
          status: "error",
          isClosable: true,
        });
      }
    }
  }, [data, loading, error]);

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
                <FormLabel htmlFor="name">Username</FormLabel>
                <Input
                  id="name"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  mb={5}
                />
                {/* <FormLabel htmlFor="email">Email</FormLabel>
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
                </RadioGroup> */}
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
