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
  FormErrorMessage,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";

export type ChangeUserPasswordInput = {
  currentPassword: string;
  newPassword: string;
};

const CHANGE = gql`
  mutation changeUserPassword($input: ChangeUserPasswordInput!) {
    changeUserPassword(input: $input) {
      message
      success
    }
  }
`;

export const ChangePassword = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const bg = useColorModeValue("gray.50", "gray.800");
  const [changePassword, { data, loading }] = useMutation(CHANGE);
  const [errorMessage, setErrorMessage] = useState("");
  const toast = useToast();

  const onSubmit = () => {
    const input = {
      currentPassword: oldPassword,
      newPassword: newPassword,
    };
    changePassword({ variables: { input } });
  };

  const onClosure = () => {
    setOldPassword("");
    setNewPassword("");
    setErrorMessage("");
    onClose();
  };

  useEffect(() => {
    if (!loading) {
      if (
        data?.changeUserPassword.message === "Password Changed Successfully"
      ) {
        setErrorMessage("");
        onClosure();
        toast({
          title: data?.changeUserPassword.message,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        setErrorMessage(data?.changeUserPassword?.message);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, loading]);

  return (
    <>
      <Button mt={5} size="md" colorScheme="blue" onClick={onOpen}>
        Change Password
      </Button>
      <Modal isOpen={isOpen} size="xl" onClose={onClosure} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Password</ModalHeader>
          <ModalCloseButton colorScheme="blue" />
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
                <FormLabel htmlFor="oldPassword">Old Password</FormLabel>
                <Input
                  id="oldPassword"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  mb={5}
                />
                <FormLabel htmlFor="newPassword">New Password</FormLabel>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  mb={5}
                />
                <FormControl isInvalid={errorMessage !== ""}>
                  {errorMessage !== "Password Changed Successfully" && (
                    <FormErrorMessage mb={5}>{errorMessage}</FormErrorMessage>
                  )}
                </FormControl>
                <Button colorScheme="blue" mr={3} onClick={onSubmit}>
                  Change
                </Button>
                <Button colorScheme="red" mr={3} onClick={onClosure}>
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
