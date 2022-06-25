import {
  Button,
  Checkbox,
  Container,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { SurveyCourseList } from "../components/SurveyCourseList";

// these schemas will probably change later, all just example data
const SUBMIT = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
      email
      roles
    }
  }
`;

export interface CourseInterface {
  subject: string;
  code: string;
  term: string;
  rating: number;
}

interface CourseListInterface {
  [key: string]: CourseInterface;
}

export const Survey = () => {
  const [nonTeachingTerm1, setNonTeachingTerm1] = useState("");
  const [nonTeachingTerm2, setNonTeachingTerm2] = useState("");
  const [hasRelief, setHasRelief] = useState(false);
  const [reliefExplaination, setReliefExplaination] = useState("");
  const [hasTopic, setHasTopic] = useState(false);
  const [topicDescription, setTopicDescription] = useState("");
  const [courseRatings, setCourseRatings] = useState<CourseListInterface>({});

  const [submit, { loading, error }] = useMutation(SUBMIT);
  const bg = useColorModeValue("gray.50", "gray.700");

  const toggleRelief = () => {
    setHasRelief(!hasRelief);
  };

  const toggleTopic = () => {
    setHasTopic(!hasTopic);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    submit({ variables: { courseRatings } });
    e.preventDefault();
  };

  const handleCourseChange = (course: CourseInterface, value: number) => {
    let newRating = courseRatings;
    let unique_id = course.subject.concat(course.code);
    newRating[unique_id] = {
      ...course,
      rating: value,
    };
    setCourseRatings(newRating);
  };

  return (
    <Flex
      w="100%"
      minH="calc(100vh - 5.5rem)"
      pt={30}
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Container mb={32} maxW="container.lg">
        <Heading mb={6}>Professor Preferences Survey</Heading>
        <Flex
          bg={bg}
          p={10}
          borderRadius={10}
          flexDir="column"
          style={{ boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.40)" }}
        >
          <form onSubmit={onSubmit}>
            <FormControl>
              <Heading size="lg">Course Preferences</Heading>
              <Divider mt={2} mb={2} />
              <SurveyCourseList handleCourseChange={handleCourseChange} />
              <Heading size="lg">Other Preferences</Heading>
              <Divider mt={2} mb={2} />
              <FormLabel htmlFor="nonTeachingTerm1">
                Non-Teaching Term 1
              </FormLabel>
              <RadioGroup
                id="nonTeachingTerm1"
                name="nonTeachingTerm1"
                onChange={setNonTeachingTerm1}
                value={nonTeachingTerm1}
              >
                <Stack direction="row">
                  <Radio value="None">None</Radio>
                  <Radio value="Fall">Fall</Radio>
                  <Radio value="Spring">Spring</Radio>
                  <Radio value="Summer">Summer</Radio>
                </Stack>
              </RadioGroup>
              <Divider mt={2} mb={2} />
              <FormLabel htmlFor="nonTeachingTerm1">
                Non-Teaching Term 2
              </FormLabel>
              <RadioGroup
                id="nonTeachingTerm2"
                name="nonTeachingTerm2"
                onChange={setNonTeachingTerm2}
                value={nonTeachingTerm2}
              >
                <Stack direction="row">
                  <Radio value="None">None</Radio>
                  <Radio value="Fall">Fall</Radio>
                  <Radio value="Spring">Spring</Radio>
                  <Radio value="Summer">Summer</Radio>
                </Stack>
              </RadioGroup>
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
                isLoading={loading}
                type="submit"
                colorScheme="green"
                variant="solid"
                w="100%"
              >
                Submit
              </Button>
            </FormControl>
            <FormControl isInvalid={error !== undefined}>
              {error !== undefined && (
                <FormErrorMessage mt={5}>{error.message}</FormErrorMessage>
              )}
            </FormControl>
          </form>
        </Flex>
      </Container>
    </Flex>
  );
};
