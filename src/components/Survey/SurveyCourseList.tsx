import { gql, useQuery } from "@apollo/client";
import {
  Radio,
  RadioGroup,
  Stack,
  Table,
  Tr,
  Thead,
  Th,
  Tbody,
  Td,
  Box,
  useToast,
  Text,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { calculateCourseRating } from "../../utils/calculateCourseRating";
import {
  ActionMeta,
  GroupBase,
  MultiValue,
  OptionBase,
  Select as SelectPlus,
} from "chakra-react-select";
import {
  CourseCodeAndSubject,
  CourseInterface,
} from "../../stores/preferences";

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

interface CourseOption extends OptionBase {
  label: string;
  value: PreferenceInterface;
}

interface PreferenceInterface {
  subject: string;
  code: string;
  term: string;
  able: string;
  willing: string;
}

interface ChildProps {
  handlePreferenceChange(course: CourseInterface, value: number): void;
  removeCourse(course: CourseCodeAndSubject): void;
  removeAllCourse(): void;
}

export const SurveyCourseList: React.FC<ChildProps> = (props) => {
  const { loading, error, data } = useQuery(COURSES);
  const [courseList, setCourseList] = useState<Array<CourseOption>>([]);
  const [selectedCourses, setSelectedCourses] = useState<Array<CourseOption>>(
    []
  );

  const toast = useToast();

  const handleChange = (
    course: PreferenceInterface,
    changeType: string,
    value: string
  ) => {
    if (changeType === "Able") {
      const newSelected = selectedCourses.map(
        (selectedCourse: CourseOption) => {
          if (
            course.code === selectedCourse.value.code &&
            course.subject === selectedCourse.value.subject
          ) {
            props.handlePreferenceChange(
              {
                subject: course.subject,
                code: course.code,
                term: course.term,
                preference: 0,
              },
              calculateCourseRating(value, selectedCourse.value.willing)
            );
            return {
              ...selectedCourse,
              value: {
                ...selectedCourse.value,
                able: value,
              },
            };
          } else return selectedCourse;
        }
      );
      setSelectedCourses(newSelected);
    } else {
      const newSelected = selectedCourses.map(
        (selectedCourse: CourseOption) => {
          if (
            course.code === selectedCourse.value.code &&
            course.subject === selectedCourse.value.subject
          ) {
            props.handlePreferenceChange(
              {
                subject: course.subject,
                code: course.code,
                term: course.term,
                preference: 0,
              },
              calculateCourseRating(selectedCourse.value.able, value)
            );
            return {
              ...selectedCourse,
              value: {
                ...selectedCourse.value,
                willing: value,
              },
            };
          } else return selectedCourse;
        }
      );
      setSelectedCourses(newSelected);
    }
  };

  const containsCourse = (
    courses: CourseOption[],
    courseToFind: PreferenceInterface
  ) => {
    const filtered = courses.filter((course) => {
      return (
        course.value.subject === courseToFind.subject &&
        course.value.code === courseToFind.code
      );
    });
    return filtered.length > 0;
  };

  const handleCourseChange = (
    courses: MultiValue<CourseOption>,
    actionMeta: ActionMeta<CourseOption>
  ) => {
    if (actionMeta.action === "select-option") {
      if (actionMeta.option) {
        const newSelected = [...selectedCourses, actionMeta.option];
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
            const courseId = course.value.subject + course.value.code;
            const removedId =
              actionMeta.removedValue.value.subject +
              actionMeta.removedValue.value.code;
            return courseId !== removedId;
          })
        );
        props.removeCourse({
          code: actionMeta.removedValue.value.code,
          subject: actionMeta.removedValue.value.subject,
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
      props.removeAllCourse();
    } else {
      toast({
        title: "Unknown Action",
        description: actionMeta.action,
        status: "error",
        isClosable: true,
      });
    }
  };

  const selectAllCourses = () => {
    setSelectedCourses(courseList);
  };

  useEffect(() => {
    if (!loading) {
      if (data && !error) {
        if (data.survey && data.survey.courses) {
          let uniqueCourses: CourseOption[] = [];
          data.survey.courses.forEach((course: PreferenceInterface) => {
            if (!containsCourse(uniqueCourses, course)) {
              uniqueCourses.push({
                label: course.subject + " " + course.code,
                value: course,
              });
            }
          });
          uniqueCourses.sort((a: CourseOption, b: CourseOption) => {
            const course_a = a.value.subject + a.value.code;
            const course_b = b.value.subject + b.value.code;
            return course_a.localeCompare(course_b);
          });
          setCourseList(uniqueCourses);
        }
      }
    }
  }, [loading, data, error]);

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
      <Text>
        Please select the courses you would like to set a preference for
      </Text>
      <Text mb={2}>
        Note that courses without a preference set will be given a default value
      </Text>
      <Button colorScheme="blue" onClick={selectAllCourses} mb={2}>
        Select All
      </Button>
      <SelectPlus<CourseOption, true, GroupBase<CourseOption>>
        isMulti
        name="courses"
        options={courseList}
        placeholder="Select courses"
        onChange={handleCourseChange}
        value={selectedCourses}
      />
      <Table variant="striped" size="sm" mt={5}>
        <Thead>
          <Tr>
            <Th>Course</Th>
            <Th>Ability to Teach</Th>
            <Th>Willingness to Teach</Th>
          </Tr>
        </Thead>
        <Tbody>
          {selectedCourses ? (
            selectedCourses.map((course: CourseOption) => {
              return (
                <Tr key={course.value.subject + course.value.code}>
                  <Td>
                    {course.value.subject} {course.value.code}
                  </Td>
                  <Td>
                    <RadioGroup
                      id="canTeach"
                      onChange={(v) => handleChange(course.value, "Able", v)}
                      value={course.value.able}
                    >
                      <Stack direction="row">
                        <Radio value="With Effort">With Effort</Radio>
                        <Radio value="Able">Able</Radio>
                      </Stack>
                    </RadioGroup>
                  </Td>
                  <Td>
                    <RadioGroup
                      id="willingTeach"
                      onChange={(v) =>
                        handleChange(course.value, "Willingness", v)
                      }
                      value={course.value.willing}
                    >
                      <Stack direction="row">
                        <Radio value="Unwilling">Unwilling</Radio>
                        <Radio value="Willing">Willing</Radio>
                        <Radio value="Very Willing">Very Willing</Radio>
                      </Stack>
                    </RadioGroup>
                  </Td>
                </Tr>
              );
            })
          ) : (
            <Tr>
              <Td>No options selected</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};
