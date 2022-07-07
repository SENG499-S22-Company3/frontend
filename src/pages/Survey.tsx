import {
  Box,
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
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { SurveyCourseList } from "../components/SurveyCourseList";

const SUBMIT = gql`
  mutation submit($input: CreateTeachingPreferenceInput!) {
    createTeachingPreference(input: $input) {
      success
      message
    }
  }
`;

const COURSES = gql`
  query GetCourses {
    survey {
      courses {
        subject
        code
        term
      }
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
  const [nonTeachingTerm, setNonTeachingTerm] = useState("");
  const [hasRelief, setHasRelief] = useState(false);
  const [reliefExplaination, setReliefExplaination] = useState("");
  const [hasTopic, setHasTopic] = useState(false);
  const [topicDescription, setTopicDescription] = useState("");
  const [courseRatings, setCourseRatings] = useState<CourseListInterface>({});

  const toast = useToast();

  const [submit, { loading, data, error }] = useMutation(SUBMIT);
  const {
    loading: courseLoading,
    data: courseData,
    error: courseError,
  } = useQuery(COURSES);
  const bg = useColorModeValue("gray.50", "gray.700");

  const toggleRelief = () => {
    setHasRelief(!hasRelief);
  };

  const toggleTopic = () => {
    setHasTopic(!hasTopic);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const courses = Object.entries(courseRatings).map((course) => {
      return {
        subject: course[1].subject,
        code: course[1].code,
        term: course[1].term,
        preference: course[1].rating,
      };
    });
    const input = {
      courses: courses,
      hasRelief: hasRelief,
      hasTopic: hasTopic,
      nonTeachingTerm: nonTeachingTerm,
      peng: false,
      reliefReason: reliefExplaination,
      topicDescription: topicDescription,
      userId: 0,
    };
    submit({ variables: { input } });
    e.preventDefault();
  };

  const handleCourseChange = (course: CourseInterface, value: number) => {
    let newRating = courseRatings;
    const unique_id = course.subject.concat(course.code);
    newRating[unique_id] = {
      ...course,
      rating: value,
    };
    setCourseRatings(newRating);
  };

  useEffect(() => {
    if (!loading) {
      if (data && !error) {
        if (data.createTeachingPreference.success) {
          toast({
            title: "Submitted preferences successfully",
            status: "success",
            isClosable: true,
          });
        } else {
          console.log(data);
          toast({
            title: "Failed to submit preferences",
            description: data.createTeachingPreference.message,
            status: "error",
            isClosable: true,
          });
        }
      } else if (error) {
        console.log(error);
        toast({
          title: "Failed to submit preferences",
          description: error.message,
          status: "error",
          isClosable: true,
        });
      }
    }
  }, [data, loading, error]);

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
            <Heading size="lg">Course Preferences</Heading>
            <SurveyCourseList
              handleCourseChange={handleCourseChange}
              data={courseData}
              loading={courseLoading}
              error={courseError}
            />
            <Heading size="lg">Other Preferences</Heading>
            <Box
              bg="gray.800"
              p={5}
              mt={5}
              mb={5}
              borderRadius={10}
              style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.40)" }}
            >
              <FormControl isRequired>
                <FormLabel htmlFor="nonTeachingTerm">
                  Non-Teaching Term
                </FormLabel>
                <RadioGroup
                  id="nonTeachingTerm"
                  name="nonTeachingTerm"
                  onChange={setNonTeachingTerm}
                  value={nonTeachingTerm}
                >
                  <Stack direction="row">
                    <Radio value="FALL">Fall</Radio>
                    <Radio value="SPRING">Spring</Radio>
                    <Radio value="SUMMER">Summer</Radio>
                  </Stack>
                </RadioGroup>
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
            </Box>
            <Button
              isLoading={loading}
              type="submit"
              colorScheme="green"
              variant="solid"
              w="100%"
            >
              Submit
            </Button>
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
