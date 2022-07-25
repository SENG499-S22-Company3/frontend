import { gql, useMutation } from "@apollo/client";
import { SmallCloseIcon, WarningIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { User } from "../../pages/Schedule";
import {
  Company,
  CourseSection,
  CourseSectionInput,
  UpdateScheduleInput,
} from "../../stores/schedule";

const UPDATE = gql`
  mutation update($input: UpdateScheduleInput!) {
    updateSchedule(input: $input) {
      message
      success
    }
  }
`;

interface SubmitButtonProps {
  schedule: CourseSection[];
  scheduleId: number;
  userData: User[];
  active: boolean;
  setActive: (active: boolean) => void;
  refreshSchedule: () => void;
}

export const SubmitButton = (props: SubmitButtonProps) => {
  const { schedule, scheduleId, userData, active, setActive, refreshSchedule } =
    props;

  const [generate, { data, loading, error }] = useMutation(UPDATE);

  const [modalOpen, setModalOpen] = useState(false);
  const [skipValidation, setSkipValidation] = useState(false);

  const toast = useToast();

  useEffect(() => {
    if (!loading) {
      if (data && !error) {
        if (data.updateSchedule.success) {
          toast({
            title: "Schedule Updated",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setActive(false);
        } else {
          toast({
            title: "Failed to Update Schedule",
            description: data.updateSchedule.message,
            status: "error",
            isClosable: true,
            duration: null,
          });
        }
      } else if (error) {
        toast({
          title: "Failed to Update Schedule",
          description: error.message,
          status: "error",
          isClosable: true,
          duration: null,
        });
      }
    }
  }, [data, loading, error, toast, setActive]);

  //used in SubmitButton component
  const submitSchedule = () => {
    console.log(schedule);
    const courseSections = schedule?.map((course) => {
      const users = course.professors.map(
        (prof) =>
          userData?.find((u) => u.displayName === prof.displayName)?.username
      );

      const { CourseID, ...restCourse } = course;

      return {
        ...restCourse,
        id: CourseID,
        professors: users,
      } as CourseSectionInput;
    });

    const scheduleInput = {
      id: scheduleId,
      courses: courseSections,
      skipValidation: skipValidation,
      validation: Company.COMPANY3,
    } as UpdateScheduleInput;

    refreshSchedule();
    return scheduleInput;
  };

  return (
    <Flex alignItems={"center"} minWidth="3rem" flexDirection={"column"}>
      <Popover placement="top" closeOnBlur={false} isOpen={active}>
        <PopoverTrigger>
          <Button
            w="200px"
            colorScheme="blue"
            variant="solid"
            onClick={() => {
              setModalOpen(true);
            }}
            isLoading={loading}
          >
            Submit Changes
          </Button>
        </PopoverTrigger>
        <PopoverContent
          color="white"
          bg="blue.800"
          borderColor="blue.800"
          marginBottom={"0.25rem"}
        >
          <PopoverArrow />
          <PopoverBody
            display="flex"
            alignItems={"center"}
            justifyContent="space-between"
          >
            <Box display={"flex"} alignItems="center">
              <WarningIcon marginRight="0.5rem" />{" "}
              <Text> You have unsaved changes</Text>
            </Box>
            <IconButton
              aria-label="close popover"
              onClick={() => setActive(false)}
              variant="subtle"
            >
              <SmallCloseIcon />
            </IconButton>
          </PopoverBody>
        </PopoverContent>
      </Popover>
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setSkipValidation(false);
          setModalOpen(false);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Submitting Schedule Changes</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Would you like to skip validating these changes? Validation
              includes enforcing specific section times, professor conflicts,
              and program requirement conflicts.{" "}
            </Text>
            <Text marginTop="1rem">
              If validation is not chosen, there are no guarantees any changes
              made have resulted in a legitimate schedule.
            </Text>
            <Checkbox
              marginTop="1rem"
              isChecked={skipValidation}
              onChange={(e) => setSkipValidation(e.target.checked)}
            >
              Yes, I would like to skip the validation
            </Checkbox>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                setModalOpen(false);
                const input = submitSchedule();
                generate({ variables: { input } });
              }}
            >
              Confirm Submission
            </Button>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
