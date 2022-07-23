import { gql, useMutation } from "@apollo/client";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { UpdateScheduleInput } from "../../stores/schedule";

const UPDATE = gql`
  mutation update($input: UpdateScheduleInput!) {
    updateSchedule(input: $input) {
      message
      success
    }
  }
`;

interface SubmitButtonProps {
  handleSubmit: () => UpdateScheduleInput;
  active: boolean;
  setActive: (active: boolean) => void;
}

export const SubmitButton = (props: SubmitButtonProps) => {
  const { handleSubmit, active, setActive } = props;

  const [generate, { data, loading, error }] = useMutation(UPDATE);

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

  return (
    <Flex alignItems={"center"} minWidth="3rem">
      {active && (
        <Alert
          status="warning"
          variant="subtle"
          marginRight="1rem"
          width="auto"
        >
          <AlertIcon />
          <AlertDescription maxWidth="sm">
            You have unsaved changes
          </AlertDescription>
        </Alert>
      )}
      <Button
        w="200px"
        colorScheme="blue"
        variant="solid"
        onClick={() => {
          const input = handleSubmit();
          generate({ variables: { input } });
        }}
        isLoading={loading}
      >
        Submit Changes
      </Button>
    </Flex>
  );
};
