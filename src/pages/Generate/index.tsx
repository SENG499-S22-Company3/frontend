import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";

import courseTerms from "./courseTerms.json";

import { gql, useMutation, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import {
  ActionMeta,
  GroupBase,
  MultiValue,
  OptionBase,
  Select as SelectPlus,
} from "chakra-react-select";

const GENERATE = gql`
  mutation generate($input: GenerateScheduleInput!) {
    generateSchedule(input: $input) {
      message
      success
    }
  }
`;

// This query is grabbing course section (courses that have already been scheudled)
// We will need a new endpoint to grab the CourseIDs I think
const GET_COURSES = gql`
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

interface CourseOption extends OptionBase {
  label: string;
  value: {
    code: string;
    subject: string;
  };
}

interface CourseSection {
  subject: string;
  code: string;
  term: string;
}
interface CourseInput {
  code: string;
  subject: string;
  section: number;
}

type Term = "FALL" | "SPRING" | "SUMMER" | "WHOLE_YEAR";

export const Generate = () => {
  const [year, setYear] = useState("");
  const [term, setTerm] = useState<Term | undefined>(undefined);
  const [courseOptions, setCourseOptions] = useState<Array<CourseOption>>([]);
  const [selectedCourses, setSelectedCourses] = useState<Array<CourseInput>>(
    []
  );
  const [algorithm1, setAlgorithm1] = useState("Company 3");
  const [algorithm2, setAlgorithm2] = useState("Company 3");
  const [generate, { data, loading, error }] = useMutation(GENERATE);

  const {
    data: courseData,
    loading: courseLoading,
    error: courseError,
  } = useQuery(GET_COURSES);

  const navigate = useNavigate();

  const bg = useColorModeValue("gray.50", "gray.700");
  const bgDark = useColorModeValue("gray.50", "gray.800");

  const toast = useToast();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const courses = {
      FALL: term === "FALL" ? selectedCourses : [],
      SPRING: term === "SPRING" ? selectedCourses : [],
      SUMMER: term === "SUMMER" ? selectedCourses : [],
    };

    if (term === "WHOLE_YEAR") {
      for (const course of selectedCourses) {
        const codeString = `${course.subject}${course.code}`;

        // the React type checker has an aneurism when trying to deal with this imported
        // JSON for some reason.
        const normallyOfferedTerms = courseTerms[
          codeString as keyof typeof courseTerms
        ] as unknown as ("FALL" | "SPRING" | "SUMMER")[] | undefined;

        if (!normallyOfferedTerms) {
          toast({
            status: "error",
            description: `Failed to determine normally offered term of ${codeString}`,
            isClosable: true,
          });
          return;
        }

        if (course.section === 0 || normallyOfferedTerms.length === 1) {
          normallyOfferedTerms.forEach((term) => {
            courses[term].push(course);
          });
        } else {
          const sectionAmounts = Array(normallyOfferedTerms.length).fill(0);
          for (let i = 0; i < course.section; i++) {
            sectionAmounts[i % sectionAmounts.length] += 1;
          }

          normallyOfferedTerms.forEach((term, i) => {
            courses[term].push({ ...course, section: sectionAmounts[i] });
          });
        }
      }
    }

    const input = {
      year: Number(year),
      fallCourses: courses.FALL,
      springCourses: courses.SPRING,
      summerCourses: courses.SUMMER,
      algorithm1: algorithm1,
      algorithm2: algorithm2,
    };
    console.log(JSON.stringify(input, null, 2));
    generate({ variables: { input } });
  };

  const handleCourseChange = (
    _courses: MultiValue<CourseOption>,
    actionMeta: ActionMeta<CourseOption>
  ) => {
    if (actionMeta.action === "select-option") {
      if (actionMeta.option !== undefined) {
        const newCourse = {
          code: actionMeta.option.value.code,
          subject: actionMeta.option.value.subject,
          section: 0,
        };
        setSelectedCourses((prev) => [...prev, newCourse]);
      } else {
        toast({
          title: "Option not defined",
          status: "error",
          isClosable: true,
        });
      }
    } else if (actionMeta.action === "remove-value") {
      if (actionMeta.removedValue) {
        const val = actionMeta.removedValue.value;
        setSelectedCourses((prev) => {
          return prev.filter(
            (c) => c.code !== val.code || c.subject !== val.subject
          );
        });
      } else {
        toast({
          title: "Failed to remove course",
          status: "error",
          isClosable: true,
        });
      }
    } else if (actionMeta.action === "clear") {
      setSelectedCourses([]);
    } else {
      toast({
        title: "Unknown Action",
        description: actionMeta.action,
        status: "error",
        isClosable: true,
      });
    }
  };

  const handleSectionChange = (course: CourseInput, value: string) => {
    const numValue = parseInt(value);
    const newSelected = selectedCourses.map((selected_course) => {
      if (
        selected_course.code === course.code &&
        selected_course.subject === course.subject
      ) {
        return { ...selected_course, section: numValue };
      } else {
        return { ...selected_course };
      }
    });
    setSelectedCourses(newSelected);
  };

  useEffect(() => {
    if (!courseLoading) {
      if (!courseError && courseData) {
        const courseKeys = new Set<string>();
        const options = (courseData.survey.courses as CourseSection[])
          .filter((course) => {
            const key = course.subject + course.code;
            if (courseKeys.has(key)) {
              return false;
            }
            courseKeys.add(key);
            return term === "WHOLE_YEAR" || course.term === term;
          })
          .map((course) => {
            return {
              label: course.subject + " " + course.code,
              value: {
                code: course.code,
                subject: course.subject,
              },
            };
          });

        setCourseOptions(options);
        setSelectedCourses(
          options.map((o) => ({
            code: o.value.code,
            subject: o.value.subject,
            section: 0,
          }))
        );
      } else {
        console.log(courseError);
      }
    }
  }, [courseData, courseError, courseLoading, term]);

  useEffect(() => {
    if (!loading) {
      if (data && !error) {
        if (data.generateSchedule.success) {
          toast({
            title: "Schedule Created",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          navigate("/schedule");
        } else {
          console.log(data);
          toast({
            title: "Failed to generate Schedule",
            description: data.generateSchedule.message,
            status: "error",
            isClosable: true,
          });
        }
      } else if (error) {
        console.log(error);
        toast({
          title: "Failed to generate Schedule",
          description: error.message,
          status: "error",
          isClosable: true,
        });
      }
    }
  }, [data, loading, error, navigate, toast]);

  return (
    <Flex
      w="100%"
      minH="calc(100vh - 5.5rem)"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Heading my={10}>Generate Schedule</Heading>
      <Container
        minW="container.xl"
        bg={bg}
        borderRadius={20}
        p={10}
        style={{ boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.40)" }}
        textAlign="center"
        centerContent
      >
        <form onSubmit={onSubmit}>
          <FormControl isRequired>
            <Grid templateColumns="repeat(2, 1fr)" gap={10}>
              <GridItem
                bg={bgDark}
                minW="container.md"
                p={10}
                borderRadius={10}
                flexDir="column"
                textAlign="left"
              >
                <Heading mb={4} size="md">
                  Options
                </Heading>
                <hr />
                <br />
                <FormLabel htmlFor="year">Year</FormLabel>
                <Select
                  placeholder="Select Year"
                  onChange={(e) => setYear(e.target.value)}
                  mb={5}
                  w="50%"
                >
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                </Select>
                <FormLabel htmlFor="term">Term</FormLabel>
                <Select
                  placeholder="Select Term"
                  onChange={(e) => setTerm(e.target.value as Term)}
                  mb={5}
                  w="50%"
                >
                  <option value="WHOLE_YEAR">Whole Year</option>
                  <option value="SPRING">Spring</option>
                  <option value="SUMMER">Summer</option>
                  <option value="FALL">Fall</option>
                </Select>
                <FormLabel htmlFor="courses">Courses</FormLabel>
                <SelectPlus<CourseOption, true, GroupBase<CourseOption>>
                  isMulti
                  name="courses"
                  value={courseOptions.filter((c) =>
                    selectedCourses.some(
                      (s) =>
                        s.code === c.value.code && s.subject === c.value.subject
                    )
                  )}
                  options={courseOptions}
                  placeholder="Select courses"
                  onChange={handleCourseChange}
                />
                <FormLabel mt={5} htmlFor="algorithm1">
                  Algorithm 1
                </FormLabel>
                <RadioGroup
                  id="algorithm1"
                  name="algorithm1"
                  onChange={setAlgorithm1}
                  value={algorithm1}
                >
                  <Stack direction="row">
                    <Radio value="COMPANY3">Company 3</Radio>
                    <Radio value="COMPANY4">Company 4</Radio>
                  </Stack>
                </RadioGroup>
                <FormLabel mt={5} htmlFor="algorithm2">
                  Algorithm 2
                </FormLabel>
                <RadioGroup
                  id="algorithm2"
                  name="algorithm2"
                  onChange={setAlgorithm2}
                  value={algorithm2}
                >
                  <Stack direction="row">
                    <Radio value="COMPANY3">Company 3</Radio>
                    <Radio value="COMPANY4">Company 4</Radio>
                  </Stack>
                </RadioGroup>
                <Flex
                  flexDirection="column"
                  w="100%"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Button
                    mt={5}
                    w="300px"
                    colorScheme="blue"
                    variant="solid"
                    type="submit"
                    isLoading={loading}
                  >
                    Generate Schedule
                  </Button>
                </Flex>
              </GridItem>

              <GridItem
                bg={bgDark}
                p={10}
                borderRadius={10}
                flexDir="column"
                textAlign="left"
              >
                <Heading mb={4} size="md">
                  Course Sections
                </Heading>
                <hr />
                <br />
                <Table variant="striped" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Course</Th>
                      <Th># of Sections</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {selectedCourses
                      ? selectedCourses.map((course) => (
                          <Tr key={course.subject + course.code}>
                            <Td>{course.subject + " " + course.code}</Td>
                            <Td>
                              <Select
                                onChange={(e) =>
                                  handleSectionChange(course, e.target.value)
                                }
                                defaultValue="0"
                              >
                                <option value="0">Auto</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                              </Select>
                            </Td>
                          </Tr>
                        ))
                      : null}
                  </Tbody>
                </Table>
              </GridItem>
            </Grid>
          </FormControl>
        </form>
      </Container>
    </Flex>
  );
};
