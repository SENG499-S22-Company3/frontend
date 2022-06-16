import { gql, useQuery } from "@apollo/client";
import {
  Box,
  FormLabel,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import React, { useEffect } from "react";

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

interface CourseInterface {
  subject: string;
  code: string;
  term: string;
  rating: Number;
}

interface ChildProps {
  handleCourseChange(course: CourseInterface, value: Number): void;
}

export const SurveyCourseList: React.FC<ChildProps> = (props) => {
  const sliderValues = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200];
  const { loading, error, data } = useQuery(COURSES);

  useEffect(() => {
    if (typeof error != "undefined") {
      console.log(error);
    }
  }, [error]);

  return (
    <>
      {loading ? (
        <>Loading</>
      ) : (
        data.survey.courses.map((course: CourseInterface, index: Number) => (
          <div key={"course-" + index}>
            <FormLabel htmlFor="slider">
              {course.subject} {course.code}
            </FormLabel>
            <Slider
              id="slider"
              colorScheme="green"
              min={0}
              max={200}
              step={20}
              mb={5}
              onChangeEnd={(v) => props.handleCourseChange(course, v)}
            >
              <SliderTrack>
                <Box position="relative" right={10} />
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb boxSize={6} />
              {sliderValues.map((value, index: Number) => (
                <SliderMark
                  key={"slider-" + index}
                  value={value}
                  mt="1"
                  ml="-2.5"
                  fontSize="sm"
                >
                  {value}
                </SliderMark>
              ))}
            </Slider>
          </div>
        ))
      )}
    </>
  );
};
