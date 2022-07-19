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
import { CourseCodeAndSubject, CourseInterface } from "../stores/preferences";

const SUBMIT = gql`
  mutation submit($input: CreateTeachingPreferenceInput!) {
    createTeachingPreference(input: $input) {
      success
      message
    }
  }
`;

export const Survey = () => {
  const [courseRatings, setCourseRatings] = useState<Array<CourseInterface>>(
    []
  );

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
    const input = {
      courses: courseRatings,
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
    submit({ variables: { input } });
  };

  const removePreference = (course: CourseCodeAndSubject) => {
    setCourseRatings(
      courseRatings.filter((ratedCourse) => {
        const courseId = course.subject + course.code;
        const removedId = ratedCourse.subject + ratedCourse.code;
        return courseId !== removedId;
      })
    );
  };

  const removeAllPreferences = () => {
    setCourseRatings([]);
  };

  const handleCourseChange = (course: CourseInterface, value: number) => {
    console.log(value);
    let found = false;
    let newRatings = courseRatings.map((ratedCourse: CourseInterface) => {
      if (
        course.subject === ratedCourse.subject &&
        course.code === ratedCourse.code
      ) {
        found = true;
        return {
          ...ratedCourse,
          preference: value,
        };
      } else return ratedCourse;
    });

    if (!found) {
      newRatings.push({
        ...course,
        preference: value,
      });
    }

    setCourseRatings(newRatings);
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
            <SurveyCourseList
              handlePreferenceChange={handleCourseChange}
              removeCourse={removePreference}
              removeAllCourse={removeAllPreferences}
            />
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
