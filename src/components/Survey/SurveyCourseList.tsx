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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { CourseInterface } from "../../pages/Survey";
import { calculateCourseRating } from "../../utils/calculateCourseRating";
import {
  ActionMeta,
  GroupBase,
  MultiValue,
  OptionBase,
  Select as SelectPlus,
} from "chakra-react-select";

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

interface PreferenceListInterface {
  [key: string]: PreferenceInterface;
}

interface ChildProps {
  handleCourseChange(course: CourseInterface, value: number): void;
}

export const SurveyCourseList: React.FC<ChildProps> = (props) => {
  const { loading, error, data } = useQuery(COURSES);
  const [preferences, setPreferences] = useState<PreferenceListInterface>({});
  const [courseList, setCourseList] = useState<Array<CourseOption>>();
  const [selectedCourses, setSelectedCourses] = useState<
    Array<PreferenceInterface>
  >([]);

  const toast = useToast();

  const handleChange = (
    course: PreferenceInterface,
    changeType: string,
    value: string
  ) => {
    let newPreferences = preferences;
    let unique_id = course.subject.concat(course.code);
    if (changeType === "Able") {
      if (unique_id in newPreferences) {
        newPreferences[unique_id] = {
          ...newPreferences[unique_id],
          able: value,
        };
      } else {
        newPreferences[unique_id] = {
          subject: course.subject,
          code: course.code,
          term: course.term,
          able: value,
          willing: "",
        };
      }
    } else {
      if (unique_id in newPreferences) {
        newPreferences[unique_id] = {
          ...newPreferences[unique_id],
          willing: value,
        };
      } else {
        newPreferences[unique_id] = {
          subject: course.subject,
          code: course.code,
          term: course.term,
          able: "",
          willing: value,
        };
      }
    }
    setPreferences(newPreferences);
    props.handleCourseChange(
      {
        subject: course.subject,
        code: course.code,
        term: course.term,
        rating: 0,
      },
      calculateCourseRating(
        newPreferences[unique_id].able,
        newPreferences[unique_id].willing
      )
    );
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
        const newSelected = [...selectedCourses, actionMeta.option.value];
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
            const courseId = course.subject + course.code;
            const removedId =
              actionMeta.removedValue.value.subject +
              actionMeta.removedValue.value.code;
            return courseId !== removedId;
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

  useEffect(() => {
    if (!loading) {
      if (data && !error) {
        if (data.survey && data.survey.courses) {
          let uniqueCourses: CourseOption[] = [];
          data.survey.courses.map((course: PreferenceInterface) => {
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

  return (
    <Box
      bg="gray.800"
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
      <SelectPlus<CourseOption, true, GroupBase<CourseOption>>
        isMulti
        name="courses"
        options={courseList}
        placeholder="Select courses"
        onChange={handleCourseChange}
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
            selectedCourses.map(
              (course: PreferenceInterface, index: number) => {
                return (
                  <Tr key={"preference-" + index}>
                    <Td>
                      {course.subject} {course.code}
                    </Td>
                    <Td>
                      <RadioGroup
                        id="canTeach"
                        onChange={(v) => handleChange(course, "Able", v)}
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
                        onChange={(v) => handleChange(course, "Willingness", v)}
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
              }
            )
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
