import { DeleteIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  IconButton,
} from "@chakra-ui/react";

interface UserInfo {
  name: string;
  email: string;
  department: string;
  role: string;
}

export const DeleteUser = (details: UserInfo) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onConfirm = () => {
    //Delete User here
    onClose();
  };

  return (
    <>
      <IconButton
        colorScheme="red"
        aria-label="Delete User"
        icon={<DeleteIcon />}
        onClick={onOpen}
        ml={2}
      />
      <Modal isOpen={isOpen} size="md" onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent textAlign="center" pb={5}>
          <ModalHeader mt={5}>
            Are you Sure you want to delete <br />'{details.name}'?
          </ModalHeader>
          <ModalCloseButton colorScheme="green" />
          <ModalBody>
            <Button colorScheme="blue" mr={3} onClick={onConfirm}>
              Confirm
            </Button>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Cancel
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
