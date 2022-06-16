import {
  Button,
  Checkbox,
  Container,
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
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useLoginStore } from "../stores/login";
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

interface CourseInterface {
  subject: string;
  code: string;
  term: string;
  rating: Number;
}

export const Survey = () => {
  const sliderValues = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200];
  const [nonTeachingTerm1, setNonTeachingTerm1] = useState("");
  const [nonTeachingTerm2, setNonTeachingTerm2] = useState("");
  const [hasRelief, setHasRelief] = useState(false);
  const [reliefExplaination, setReliefExplaination] = useState("");
  const [hasTopic, setHasTopic] = useState(false);
  const [topicDescription, setTopicDescription] = useState("");
  const [courseRatings, setCourseRatings] = useState<Array<CourseInterface>>(
    []
  );
  const [submit, { data, loading, error }] = useMutation(SUBMIT);
  const bg = useColorModeValue("gray.50", "gray.700");

  const loginState = useLoginStore();
  const navigate = useNavigate();

  const toggleRelief = () => {
    setHasRelief(!hasRelief);
  };

  const toggleTopic = () => {
    setHasTopic(!hasTopic);
  };

  useEffect(() => {
    if (loginState.loggedIn) {
      navigate("/");
    }
  }, [loginState.loggedIn, navigate]);

  useEffect(() => {
    if (data && !error && !loading) {
      // TODO: this route will change to whatever the default page is once the
      // user is logged in
      navigate("/");
    }
  }, [data, error, loading, navigate]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    submit({ variables: {} });
    e.preventDefault();
  };

  //Check the course rating object, add if rating doesn't exist, update if rating exists
  const handleCourseChange = (course: CourseInterface, value: Number) => {
    let found = false;

    const newRatings = courseRatings.map((oldRating) => {
      if (
        oldRating.subject === course.subject &&
        oldRating.code === course.code
      ) {
        found = true;
        return { ...oldRating, rating: value };
      }
      return oldRating;
    });

    if (!found) {
      setCourseRatings([
        ...courseRatings,
        {
          ...course,
          rating: value,
        },
      ]);
    } else {
      setCourseRatings(newRatings);
    }
  };

  useEffect(() => {
    console.log(courseRatings);
  }, [courseRatings]);

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
            <FormControl isRequired>
              <SurveyCourseList handleCourseChange={handleCourseChange} />
              <FormLabel htmlFor="nonTeachingTerm1">
                Non-Teaching Term 1
              </FormLabel>
              <RadioGroup
                id="nonTeachingTerm1"
                name="nonTeachingTerm1"
                onChange={setNonTeachingTerm1}
                value={nonTeachingTerm1}
                mb={5}
              >
                <Stack direction="row">
                  <Radio value="None">None</Radio>
                  <Radio value="Fall">Fall</Radio>
                  <Radio value="Spring">Spring</Radio>
                  <Radio value="Summer">Summer</Radio>
                </Stack>
              </RadioGroup>
              <FormLabel htmlFor="nonTeachingTerm1">
                Non-Teaching Term 2
              </FormLabel>
              <RadioGroup
                id="nonTeachingTerm2"
                name="nonTeachingTerm2"
                onChange={setNonTeachingTerm2}
                value={nonTeachingTerm2}
                mb={5}
              >
                <Stack direction="row">
                  <Radio value="None">None</Radio>
                  <Radio value="Fall">Fall</Radio>
                  <Radio value="Spring">Spring</Radio>
                  <Radio value="Summer">Summer</Radio>
                </Stack>
              </RadioGroup>

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
                mb={5}
              />

              <FormLabel htmlFor="hasRelief">Topics Course?</FormLabel>
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
