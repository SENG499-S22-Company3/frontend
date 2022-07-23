import {
  Box,
  Button,
  Flex,
  Radio,
  RadioGroup,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import {
  ActionMeta,
  GroupBase,
  MultiValue,
  OptionBase,
  Select as SelectPlus,
} from "chakra-react-select";
import React, { useState } from "react";
import {
  CoursePreference,
  PreferenceInterface,
} from "../../stores/preferences";
import { CourseID } from "../../stores/schedule";
import { calculateCourseRating } from "../../utils/calculateCourseRating";

export interface CourseOption extends OptionBase {
  label: string;
  value: PreferenceInterface;
}

interface ChildProps {
  courses: CourseOption[];
  handlePreferenceChange(course: CoursePreference, value: number): void;
  removeCourse(course: CourseID): void;
  removeAllCourses(): void;
}

export const SurveyCourseList: React.FC<ChildProps> = (props) => {
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

  const handleCourseChange = (
    _courses: MultiValue<CourseOption>,
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
          term: actionMeta.removedValue.value.term,
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
      props.removeAllCourses();
    }
  };

  const selectAllCourses = () => {
    setSelectedCourses(props.courses);
  };

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
        of 0 (Not willing to teach).
      </Text>
      <Flex w="100%">
        <Box flexGrow={1}>
          <SelectPlus<CourseOption, true, GroupBase<CourseOption>>
            isMulti
            name="courses"
            options={props.courses}
            placeholder="Select courses"
            onChange={handleCourseChange}
            value={selectedCourses}
          />
        </Box>
        <Button
          flexShrink={0}
          colorScheme="blue"
          onClick={selectAllCourses}
          mb={2}
          ml={2}
        >
          Select All
        </Button>
      </Flex>
      {selectedCourses.length > 0 && (
        <Table variant="striped" size="sm" mt={5}>
          <Thead>
            <Tr>
              <Th>Course</Th>
              <Th>Ability to Teach</Th>
              <Th>Willingness to Teach</Th>
            </Tr>
          </Thead>
          <Tbody>
            {selectedCourses.map((course: CourseOption) => {
              return (
                <Tr key={course.label}>
                  <Td>{course.label}</Td>
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
            })}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};
