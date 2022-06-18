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

interface ChildProps {
  handleCourseChange(course: CourseInterface, value: number): void;
}

export const SurveyCourseList: React.FC<ChildProps> = (props) => {
  const { loading, error, data } = useQuery(COURSES, {});
  const [preferences, setPreferences] = useState<Array<PreferenceInterface>>(
    []
  );

  useEffect(() => {
    if (typeof error != "undefined") {
      console.log(error);
    }
  }, [error]);

  useEffect(() => {}, []);

  const calculateRating = (able: string, willing: string) => {
    if (able === "With Effort" && willing === "Unwilling") {
      return 20;
    } else if (able === "Able" && willing === "Unwilling") {
      return 39;
    } else if (able === "With Effort" && willing === "Willing") {
      return 40;
    } else if (able === "Able" && willing === "Willing") {
      return 78;
    } else if (able === "With Effort" && willing === "Very Willing") {
      return 100;
    } else if (able === "Able" && willing === "Very Willing") {
      return 195;
    } else {
      return 0;
    }
  };

  const handleAbleChange = (course: PreferenceInterface, value: string) => {
    let found = false;

    const newPreferences = preferences.map((oldPreference) => {
      if (
        oldPreference.subject === course.subject &&
        oldPreference.code === course.code
      ) {
        found = true;
        props.handleCourseChange(
          {
            subject: oldPreference.subject,
            code: oldPreference.code,
            term: oldPreference.term,
            rating: 0,
          },
          calculateRating(value, oldPreference.willing)
        );
        return { ...oldPreference, able: value };
      } else {
        return oldPreference;
      }
    });
    if (!found) {
      setPreferences([
        ...preferences,
        {
          ...course,
          able: value,
          willing: "",
        },
      ]);
    } else {
      setPreferences(newPreferences);
    }
  };

  const handleWillingChange = (course: PreferenceInterface, value: string) => {
    let found = false;

    const newPreferences = preferences.map((oldPreference) => {
      if (
        oldPreference.subject === course.subject &&
        oldPreference.code === course.code
      ) {
        found = true;
        props.handleCourseChange(
          {
            subject: oldPreference.subject,
            code: oldPreference.code,
            term: oldPreference.term,
            rating: 0,
          },
          calculateRating(oldPreference.able, value)
        );
        return { ...oldPreference, willing: value };
      } else {
        return oldPreference;
      }
    });
    if (!found) {
      setPreferences([
        ...preferences,
        {
          ...course,
          able: "",
          willing: value,
        },
      ]);
    } else {
      setPreferences(newPreferences);
    }
  };

  return (
    <>
      {loading ? (
        <>Loading</>
      ) : (
        data.survey.courses.map(
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
                    onChange={(v) => handleAbleChange(course, v)}
                  >
                    <Stack direction="row">
                      <Radio value="Able">Able</Radio>
                      <Radio value="With Effort">With Effort</Radio>
                    </Stack>
                  </RadioGroup>
                </GridItem>
                <GridItem>
                  <FormLabel htmlFor="willingTeach">
                    Willing to Teach?
                  </FormLabel>
                  <RadioGroup
                    id="willingTeach"
                    onChange={(v) => handleWillingChange(course, v)}
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
        )
      )}
    </>
  );
};
