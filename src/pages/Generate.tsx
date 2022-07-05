import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Flex,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
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

const GET_COURSES = gql`
  query get_courses($term: Term!) {
    courses(term: $term) {
      CourseID {
        subject
        code
      }
    }
  }
`;

interface CoursePreference {
  course: string;
  sections: number;
}

interface CourseOption extends OptionBase {
  label: string;
  value: {
    code: string;
    subject: string;
  };
}

interface CourseSection {
  CourseID: {
    subject: string;
    code: string;
  };
}
interface CourseInput {
  code: string;
  subject: string;
  sections: number;
}

export const Generate = () => {
  const [year, setYear] = useState("");
  const [term, setTerm] = useState("");
  const [courseOptions, setCourseOptions] = useState<Array<CourseOption>>([]);
  const [selectedCourses, setSelectedCourses] = useState<Array<CourseInput>>(
    []
  );
  const [generate, { data, loading, error }] = useMutation(GENERATE);
  const {
    data: courseData,
    loading: courseLoading,
    error: courseError,
  } = useQuery(GET_COURSES, {
    variables: { term },
  });
  const navigate = useNavigate();

  const bg = useColorModeValue("gray.50", "gray.700");

  const toast = useToast();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log(selectedCourses);
    const input = {
      year: Number(year),
    };
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
            sections: 1,
          },
        ];
        setSelectedCourses(newSelected);
      } else {
        console.log("Option Not Defined");
      }
    } else if (actionMeta.action === "remove-value") {
      if (actionMeta.removedValue) {
        setSelectedCourses(
          selectedCourses.filter(function (course) {
            return (
              course.code !== actionMeta.removedValue.value.code &&
              course.subject !== actionMeta.removedValue.value.subject
            );
          })
        );
      } else {
        console.log("Removed Value Not Defined");
      }
    } else if (actionMeta.action === "clear") {
      setSelectedCourses([]);
    } else {
      console.log("Unknown Action: " + actionMeta.action);
    }
  };

  const handleSectionChange = (course: CourseInput, value: number) => {
    console.log(course);
    console.log(value);
    const newSelected = selectedCourses.map((selected_course) => {
      if (
        selected_course.code === course.code &&
        selected_course.subject === course.subject
      ) {
        return { ...selected_course, sections: value };
      } else {
        return { ...selected_course };
      }
    });
    setSelectedCourses(newSelected);
  };

  useEffect(() => {
    if (!courseError && !courseLoading && courseData) {
      const options = courseData.courses.map((course: CourseSection) => {
        return {
          label: course.CourseID.subject + " " + course.CourseID.code,
          value: course.CourseID,
        };
      });
      setCourseOptions(options);
    }
  }, [courseData, courseError, courseLoading]);

  useEffect(() => {
    if (!loading) {
      if (data && !error) {
        if (data.generateSchedule.success) {
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
  }, [data, loading, error]);

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
          <Grid templateColumns="repeat(2, 1fr)" gap={10}>
            <GridItem
              bg="gray.800"
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
                value={year}
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
                value={term}
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
            </GridItem>
            <GridItem
              bg="gray.800"
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
                            <NumberInput
                              defaultValue={1}
                              max={10}
                              min={1}
                              w={20}
                              onChange={(valueAsString, ValueAsNumber) =>
                                handleSectionChange(course, ValueAsNumber)
                              }
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
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
        </form>
      </Container>
    </Flex>
  );
};
