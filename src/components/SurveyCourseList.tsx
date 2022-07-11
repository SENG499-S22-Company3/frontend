import { gql, useQuery } from "@apollo/client";
import {
  Text,
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
} from "@chakra-ui/react";
import React, { useState } from "react";
import { CourseInterface } from "../pages/Survey";
import { calculateCourseRating } from "../utils/calculateCourseRating";

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

  if (loading) {
    return <>Loading</>;
  } else if (!data || error) {
    return (
      <Text color="red.400" mb={3}>
        Failed to course fetch data
      </Text>
    );
  } else {
    return (
      <Box
        bg="gray.800"
        p={5}
        mt={5}
        mb={5}
        borderRadius={10}
        style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.40)" }}
      >
        <Table variant="striped" size="sm">
          <Thead>
            <Tr>
              <Th>Course</Th>
              <Th>Ability to Teach</Th>
              <Th>Willingness to Teach</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.survey.courses
              .filter((course: PreferenceInterface) => {
                return course.term === "SUMMER";
              })
              .map((course: PreferenceInterface, index: number) => {
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
                          <Radio value="Able">Able</Radio>
                          <Radio value="With Effort">With Effort</Radio>
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
              })}
          </Tbody>
        </Table>
      </Box>
    );
  }
};
