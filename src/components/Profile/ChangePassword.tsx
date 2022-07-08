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
} from "@chakra-ui/react";
import { useState } from "react";

export const ChangePassword = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const bg = useColorModeValue("gray.50", "gray.800");

  const onSubmit = () => {
    setOldPassword("");
    setNewPassword("");
    onClose();
  };

  return (
    <>
      <Button mt={5} size="md" colorScheme="blue" onClick={onOpen}>
        Change Password
      </Button>
      <Modal isOpen={isOpen} size="xl" onClose={onClose} isCentered>
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
                <Button colorScheme="blue" mr={3} onClick={onSubmit}>
                  Change
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
