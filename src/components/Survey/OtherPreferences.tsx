import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Select,
  Text,
  Textarea,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { CourseAmountInput } from "./CourseAmountInput";

interface ChildProps {
  loading: boolean;
  handleSubmit(
    hasRelief: boolean,
    hasTopic: boolean,
    reliefExplaination: string,
    topicDescription: string,
    numFallCourses: number,
    numSpringCourses: number,
    numSummerCourses: number
  ): void;
}

export const OtherPreferences: React.FC<ChildProps> = (props) => {
  const [professorType, setProfessorType] = useState("Teaching");
  const [numFallCourses, setNumFallCourses] = useState(0);
  const [numSpringCourses, setNumSpringCourses] = useState(0);
  const [numSummerCourses, setNumSummerCourses] = useState(0);
  const [courseAmountError, setCourseAmountError] = useState("");
  const [hasRelief, setHasRelief] = useState(false);
  const [reliefExplaination, setReliefExplaination] = useState("");
  const [hasTopic, setHasTopic] = useState(false);
  const [topicDescription, setTopicDescription] = useState("");

  const toast = useToast();

  const toggleRelief = () => {
    setHasRelief(!hasRelief);
  };

  const toggleTopic = () => {
    setHasTopic(!hasTopic);
  };

  const submitForm = () => {
    if (courseAmountError !== "") {
      toast({
        title: "Failed to submit preferences",
        description: courseAmountError,
        status: "error",
        isClosable: true,
      });
    } else {
      props.handleSubmit(
        hasRelief,
        hasTopic,
        reliefExplaination,
        topicDescription,
        numFallCourses,
        numSpringCourses,
        numSummerCourses
      );
    }
  };

  useEffect(() => {
    const totalCourses = numFallCourses + numSpringCourses + numSummerCourses;
    if (professorType === "Teaching") {
      if (totalCourses === 6) {
        setCourseAmountError("");
      } else {
        setCourseAmountError(
          "Teaching professors must have 6 total course slots"
        );
      }
    } else if (professorType === "Research") {
      if (totalCourses === 3) {
        setCourseAmountError("");
      } else {
        setCourseAmountError(
          "Research professors must have 3 total course slots"
        );
      }
    }
  }, [professorType, numFallCourses, numSpringCourses, numSummerCourses]);

  const bg = useColorModeValue("gray.50", "gray.800");

  return (
    <Box
      bg={bg}
      p={5}
      mt={5}
      mb={5}
      borderRadius={10}
      style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.40)" }}
    >
      <FormControl isRequired>
        <FormLabel htmlFor="profType">Professor Type</FormLabel>
        <Select
          id="profType"
          onChange={(e) => setProfessorType(e.target.value)}
          mb={5}
          w="25%"
          minW="220px"
          defaultValue={"Teaching"}
        >
          <option value="Teaching">Teaching</option>
          <option value="Research">Research</option>
        </Select>
        <FormLabel>Prefered Courses Per Term</FormLabel>
        <Flex direction="row" gap={5}>
          <CourseAmountInput
            title="Fall"
            max={6}
            setAmount={setNumFallCourses}
          />
          <CourseAmountInput
            title="Spring"
            max={6}
            setAmount={setNumSpringCourses}
          />
          <CourseAmountInput
            title="Summer"
            max={6}
            setAmount={setNumSummerCourses}
          />
        </Flex>
        <Text mt={1} mb={5} color="red.500">
          {courseAmountError}
        </Text>
      </FormControl>
      <Divider mt={2} mb={2} />
      <FormLabel htmlFor="hasRelief">Relief</FormLabel>
      <Checkbox id="hasRelief" mb={2} onChange={toggleRelief}>
        Has Relief?
      </Checkbox>
      <Textarea
        isDisabled={!hasRelief}
        id="large_text"
        value={reliefExplaination}
        placeholder="Relief Explaination"
        onChange={(e) => setReliefExplaination(e.target.value)}
        size="sm"
      />
      <Divider mt={4} mb={2} />
      <FormLabel htmlFor="hasRelief">Topics Course</FormLabel>
      <Checkbox id="hasTopic" mb={2} onChange={toggleTopic}>
        Has Topic?
      </Checkbox>
      <Textarea
        isDisabled={!hasTopic}
        id="topicDescription"
        value={topicDescription}
        placeholder="Topics Course Description"
        onChange={(e) => setTopicDescription(e.target.value)}
        size="sm"
        mb={5}
      />
      <Button
        isLoading={props.loading}
        colorScheme="blue"
        variant="solid"
        w="100%"
        onClick={submitForm}
      >
        Submit
      </Button>
    </Box>
  );
};
