import { gql, useMutation, useQuery } from "@apollo/client";
import {
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Spinner,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import shallow from "zustand/shallow";
import { OtherPreferences } from "../components/Survey/OtherPreferences";
import { SurveyCourseList } from "../components/Survey/SurveyCourseList";
import { useLoginStore } from "../stores/login";
import { CoursePreference } from "../stores/preferences";
import { CourseID } from "../stores/schedule";

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

export const Survey = () => {
  const [courseRatings, setCourseRatings] = useState<
    Record<string, CoursePreference>
  >({});

  const toast = useToast();

  const [user, persistUser] = useLoginStore(
    (state) => [state.user, state.persistUser],
    shallow
  );
  const [submit, { loading, data, error }] = useMutation(SUBMIT);

  const {
    loading: coursesLoading,
    error: coursesError,
    data: coursesData,
  } = useQuery(COURSES);

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
    // set a preference of 0 for any courses that the user didn't explicity
    // specify a preference for
    const finalRatings: CoursePreference[] = coursesData.survey.courses!.map(
      (course: CourseID) =>
        courseRatings[`${course.subject}${course.code}${course.term}`] ?? {
          code: course.code,
          subject: course.subject,
          term: course.term,
          preference: 0,
        }
    );

    const input = {
      courses: finalRatings,
      hasRelief: hasRelief,
      hasTopic: hasTopic,
      nonTeachingTerm: null,
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

  const removePreference = (course: CourseID) => {
    setCourseRatings((prev) => {
      const key = `${course.subject}${course.code}${course.term}`;
      delete prev[key];
      return prev;
    });
  };

  const removeAllPreferences = () => {
    setCourseRatings({});
  };

  const handleCourseChange = (course: CoursePreference, value: number) => {
    const key = `${course.subject}${course.code}${course.term}`;

    setCourseRatings((prev) => {
      if (prev[key] === undefined) {
        prev[key] = {
          ...course,
          preference: value,
        };
      } else {
        prev[key].preference = value;
      }

      return prev;
    });
  };

  useEffect(() => {
    if (!loading) {
      if (data && !error) {
        if (data.createTeachingPreference.success) {
          if (user !== undefined) {
            // store the preferences into the user object right away so
            // the state updates immediately
            const preferences = coursesData.survey.courses!.map(
              (course: CourseID) => {
                const key = `${course.subject}${course.code}${course.term}`;
                const r = courseRatings[key];
                return {
                  id: {
                    code: r ? r.code : course.code,
                    subject: r ? r.subject : course.subject,
                    title: r ? r.title : course.title,
                    term: r ? r.term : course.term,
                  },
                  preference: r ? r.preference : 0,
                };
              }
            );

            const newUser = { ...user, preferences };
            persistUser(newUser);
          }

          toast({
            title: "Submitted preferences successfully",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Failed to submit preferences",
            description: data.createTeachingPreference.message,
            status: "error",
            duration: null,
            isClosable: true,
          });
        }
      } else if (error) {
        toast({
          title: "Failed to submit preferences",
          description: error.message,
          status: "error",
          duration: null,
          isClosable: true,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, loading, error]);

  if (coursesLoading) {
    return (
      <Flex
        w="100%"
        minH="calc(100vh - 5.5rem)"
        pt={30}
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Spinner />
      </Flex>
    );
  }

  if (coursesError) {
    return (
      <Flex
        w="100%"
        minH="calc(100vh - 5.5rem)"
        pt={30}
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Heading fontSize="xl">
          Error: Failed to retrieve list of courses
        </Heading>
        <Text>{coursesError.message}</Text>
      </Flex>
    );
  }

  if (user !== undefined && user.preferences.length > 0) {
    return (
      <Flex
        w="100%"
        minH="calc(100vh - 5.5rem)"
        pt={30}
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Heading>You have completed the preference survey! Thank you.</Heading>
      </Flex>
    );
  }

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
              courses={coursesData.survey.courses.map((c: CourseID) => ({
                label: `${c.subject} ${c.code} (${c.term})`,
                value: {
                  subject: c.subject,
                  code: c.code,
                  term: c.term,
                  able: "",
                  willing: "",
                },
              }))}
              removeCourse={removePreference}
              removeAllCourses={removeAllPreferences}
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
