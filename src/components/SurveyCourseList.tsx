import { gql, useQuery } from "@apollo/client";
import {
  Divider,
  Flex,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
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
  const { loading, error, data } = useQuery(COURSES, {});
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
    return <>Failed to course fetch data</>;
  } else
    return data.survey.courses.map(
      (course: PreferenceInterface, index: number) => (
        <Flex key={"course-" + index} w="full" mb={2}>
          <Grid templateColumns="repeat(3,1fr)" gap={3}>
            <GridItem colSpan={3}>
              <Heading size="sm">
                {course.subject} {course.code}
              </Heading>
            </GridItem>
            <GridItem>
              <FormLabel htmlFor="canTeach">Can Teach?</FormLabel>
              <RadioGroup
                id="canTeach"
                onChange={(v) => handleChange(course, "Able", v)}
              >
                <Stack direction="row">
                  <Radio value="Able">Able</Radio>
                  <Radio value="With Effort">With Effort</Radio>
                </Stack>
              </RadioGroup>
            </GridItem>
            <GridItem>
              <FormLabel htmlFor="willingTeach">Willing to Teach?</FormLabel>
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
            </GridItem>
            <GridItem colSpan={3}>
              <Divider mt={2} mb={2} />
            </GridItem>
          </Grid>
        </Flex>
      )
    );
};
