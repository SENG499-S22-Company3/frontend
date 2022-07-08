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

export const Generate = () => {
  const [year, setYear] = useState("");
  const [term, setTerm] = useState("");
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
    const input = {
      year: Number(year),
      term: term,
      courses: selectedCourses,
      algorithm1: algorithm1,
      algorithm2: algorithm2,
    };
    console.log(input);
    generate({ variables: { input } });
  };

  const handleCourseChange = (
    courses: MultiValue<CourseOption>,
    actionMeta: ActionMeta<CourseOption>
  ) => {
    if (actionMeta.action === "select-option") {
      if (actionMeta.option) {
        const newSelected = [
          ...selectedCourses,
          {
            code: actionMeta.option.value.code,
            subject: actionMeta.option.value.subject,
            section: 0,
          },
        ];
        setSelectedCourses(newSelected);
      } else {
        toast({
          title: "Option not defined",
          status: "error",
          isClosable: true,
        });
      }
    } else if (actionMeta.action === "remove-value") {
      if (actionMeta.removedValue) {
        setSelectedCourses(
          selectedCourses.filter((course) => {
            return (
              course.code !== actionMeta.removedValue.value.code &&
              course.subject !== actionMeta.removedValue.value.subject
            );
          })
        );
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
        const options = courseData.survey.courses
          .filter((course: CourseSection) => {
            return course.term === term;
          })
          .map((course: CourseSection) => {
            return {
              label: course.subject + " " + course.code,
              value: {
                code: course.code,
                subject: course.subject,
              },
            };
          });
        setCourseOptions(options);
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
            title: "Scheudle Created",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          navigate("/schedule");
        } else {
          console.log(data);
          toast({
            title: "Failed to Generate Schedule",
            description: data.generateSchedule.message,
            status: "error",
            isClosable: true,
          });
        }
      } else if (error) {
        console.log(error);
        toast({
          title: "Failed to Generate Schedule",
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
      pt={30}
      alignItems="center"
      justifyContent="center"
    >
      <Container
        minW="900px"
        bg={bg}
        borderRadius={20}
        p={10}
        style={{ boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.40)" }}
        textAlign="center"
        centerContent
      >
        <Heading mb={4}>Generate Schedule</Heading>

        <form onSubmit={onSubmit}>
          <FormControl isRequired>
            <Grid templateColumns="repeat(2, 1fr)" gap={10}>
              <GridItem
                bg={bgDark}
                minW="450px"
                p={10}
                borderRadius={10}
                flexDir="column"
                style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.40)" }}
              >
                <Heading mb={4} size="md">
                  Options
                </Heading>

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
                  onChange={(e) => setTerm(e.target.value)}
                  mb={5}
                  w="50%"
                >
                  <option value="SPRING">Spring</option>
                  <option value="SUMMER">Summer</option>
                  <option value="FALL">Fall</option>
                </Select>
                <FormLabel htmlFor="courses">Courses</FormLabel>
                <SelectPlus<CourseOption, true, GroupBase<CourseOption>>
                  isMulti
                  name="courses"
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
              </GridItem>
              <GridItem
                bg={bgDark}
                p={10}
                borderRadius={10}
                flexDir="column"
                style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.40)" }}
              >
                <Heading mb={4} size="md">
                  Course Selections
                </Heading>
                <Table variant="striped" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Course</Th>
                      <Th>Sections</Th>
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
                              >
                                <option selected value="0">
                                  Default
                                </option>
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
            <Button
              mt={5}
              w="300px"
              colorScheme="purple"
              variant="solid"
              type="submit"
              isLoading={loading}
            >
              Generate Schedule
            </Button>
          </FormControl>
        </form>
      </Container>
    </Flex>
  );
};
