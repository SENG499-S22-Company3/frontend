import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Flex,
} from "@chakra-ui/react";

interface SubmitButtonProps {
  handleSubmit: () => void;
  active: boolean;
  setActive: (active: boolean) => void;
}

export const SubmitButton = (props: SubmitButtonProps) => {
  const { handleSubmit, active, setActive } = props;

  return (
    <Flex alignItems={"center"}>
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
        backgroundColor="purple.300"
        colorScheme="purple"
        variant="solid"
        disabled={!active}
        onClick={() => {
          setActive(false);
          handleSubmit();
        }}
      >
        Submit Changes
      </Button>
    </Flex>
  );
};
