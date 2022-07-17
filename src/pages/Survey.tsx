import {
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { SurveyCourseList } from "../components/Survey/SurveyCourseList";
import { OtherPreferences } from "../components/Survey/OtherPreferences";

const SUBMIT = gql`
  mutation submit($input: CreateTeachingPreferenceInput!) {
    createTeachingPreference(input: $input) {
      success
      message
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
  const [courseRatings, setCourseRatings] = useState<CourseListInterface>({});

  const toast = useToast();

  const [submit, { loading, data, error }] = useMutation(SUBMIT);
  const bg = useColorModeValue("gray.50", "gray.700");

  const onSubmit = (
    hasRelief: boolean,
    hasTopic: boolean,
    reliefExplaination: string,
    topicDescription: string,
    numFallCourses: number,
    numSpringCourses: number,
    numSummerCourses: number
  ) => {
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
      nonTeachingTerm: "FALL",
      peng: false,
      reliefReason: reliefExplaination,
      topicDescription: topicDescription,
      fallTermCourses: numFallCourses,
      springTermCourses: numSpringCourses,
      summerTermCourses: numSummerCourses,
      userId: 0,
    };
    console.log(input);
    // submit({ variables: { input } });
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
  }, [data, loading, error, toast]);
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
          <form>
            <Heading size="lg" mb={5}>
              Course Preferences
            </Heading>
            <SurveyCourseList handleCourseChange={handleCourseChange} />
            <Heading size="lg">Other Preferences</Heading>
            <OtherPreferences loading={loading} handleSubmit={onSubmit} />
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
