import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Checkbox,
  RadioGroup,
  Radio,
  Container,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Flex,
} from "@chakra-ui/react";
import DateBox from "devextreme-react/date-box";
import { Appointment, CourseID } from "../../stores/schedule";
import { ViewTypes } from "../../pages/Schedule";
import { gql, useQuery } from "@apollo/client";
import { OptionBase, Select } from "chakra-react-select";

const USERS = gql`
  query getUsers {
    allUsers {
      displayName
    }
  }
`;

const GET_COURSES = gql`
  query GetCourses {
    survey {
      courses {
        subject
        code
        term
        title
      }
    }
  }
`;

interface Options extends OptionBase {
  label: string;
  value: string;
}

interface CourseOptions extends OptionBase {
  label: string;
  value: {
    code: string;
    subject: string;
    title: string;
  };
}

export interface ModalItem extends Appointment {
  days: string[];
  removedDays?: string[];
}

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updatedCourse: ModalItem) => void;
  courseData: ModalItem;
  viewState: ViewTypes;
}
export const AppointmentModal = (props: AppointmentModalProps) => {
  const { isOpen, onClose, onSubmit, courseData, viewState } = props;

  const {
    data: coursesData,
    loading: coursesLoading,
    error: coursesError,
  } = useQuery(GET_COURSES);
  const { data, loading, error } = useQuery(USERS);

  const [professorOptions, setProfessorOptions] = useState<Options[]>();
  const [coursesOptions, setCoursesOptions] = useState<CourseOptions[]>();

  const [courseUpdate, setCourseUpdate] = useState(courseData);
  const [timeError, setTimeError] = useState(false);
  const [dayError, setDayError] = useState(false);

  const defaultProfessors = {
    value: courseUpdate.professors[0],
    label: courseUpdate.professors[0],
  };
  const defaultCourse = {
    value: {
      code: courseUpdate.code,
      subject: courseUpdate.subject,
      title: courseUpdate.title,
    },
    label: courseUpdate.subject + " " + courseUpdate.code,
  };

  const initialRef = useRef(null);
  const days = courseUpdate.days;

  useEffect(() => {
    if (!loading) {
      if (!error && data) {
        const profNames = data.allUsers.map((prof: { displayName: string }) => {
          return {
            label: prof.displayName,
            value: prof.displayName,
          };
        });
        setProfessorOptions(profNames);
      } else {
        console.log(error);
      }
    }
  }, [data, error, loading]);

  useEffect(() => {
    if (!coursesLoading) {
      if (!coursesError && coursesData) {
        const queryResult = coursesData.survey.courses;
        const termData = queryResult.filter(
          (course: CourseID) => course.term === courseData.term
        );
        const courses = termData.map((course: CourseID) => {
          return {
            label: course.subject + " " + course.code,
            value: {
              code: course.code,
              subject: course.subject,
              title: course.title,
            },
          };
        });
        setCoursesOptions(courses);
      }
    }
  }, [coursesData, coursesError, coursesLoading, courseData.term]);

  const handleCheck = (weekDay: string, isChecked?: boolean) => {
    //handles the radio button case
    if (!isChecked && isChecked !== false) {
      setCourseUpdate({
        ...courseUpdate,
        days: [weekDay],
      });
      return;
    }

    //handles check box case
    let newDays = days;
    if (isChecked) {
      newDays = [...newDays, weekDay];
    } else {
      newDays = newDays.filter((day) => day !== weekDay);
    }
    setCourseUpdate({ ...courseUpdate, days: newDays });
  };

  const handleCourseChange = (courseValue?: {
    code: string;
    subject: string;
    title: string;
  }) => {
    console.log(courseValue);
    if (!courseValue) return;
    setCourseUpdate({
      ...courseUpdate,
      code: courseValue.code,
      subject: courseValue.subject,
      title: courseValue.title,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      courseUpdate.startTime.getTime() > courseUpdate.endTime.getTime() ||
      (courseUpdate.startDate?.getTime() || 0) >
        (courseUpdate.endDate?.getTime() || 0)
    ) {
      setTimeError(true);
      return;
    }

    if (courseUpdate.days.length === 0) {
      setDayError(true);
      return;
    }

    const removedDays = courseData.days.filter(
      (day) => !courseUpdate.days.includes(day)
    );
    onSubmit({ ...courseUpdate, removedDays: removedDays });
    onClose();
  };

  return (
    <>
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>Edit Course Section</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl isRequired>
                <Flex>
                  <Flex
                    flexDirection={"column"}
                    marginRight={"1.5rem"}
                    width="15rem"
                  >
                    <FormLabel htmlFor="course">Course</FormLabel>
                    <Select
                      id="course"
                      options={coursesOptions}
                      placeholder="Course"
                      onChange={(e) => handleCourseChange(e?.value)}
                      value={defaultCourse}
                    />
                  </Flex>
                  <Flex flexDirection={"column"}>
                    <FormLabel htmlFor="sectionNumber">
                      Section Number
                    </FormLabel>
                    <Input
                      id="sectionNumber"
                      placeholder="Section"
                      value={courseUpdate.sectionNumber}
                      onChange={(e) =>
                        setCourseUpdate({
                          ...courseUpdate,
                          sectionNumber: e.target.value,
                        })
                      }
                    />
                  </Flex>
                </Flex>
                <FormLabel htmlFor="title" marginTop={"1.5rem"}>
                  Course Title
                </FormLabel>
                <Input
                  id="title"
                  placeholder="Title"
                  value={courseUpdate.title}
                  readOnly
                  disabled
                  onChange={(e) =>
                    setCourseUpdate({
                      ...courseUpdate,
                      title: e.target.value,
                    })
                  }
                />
                <FormLabel htmlFor="professors" marginTop={"1.5rem"}>
                  Professors
                </FormLabel>
                <Select
                  id="professors"
                  options={professorOptions}
                  placeholder="Professors"
                  onChange={(e) =>
                    setCourseUpdate({
                      ...courseUpdate,
                      professors: e ? [e.value] : [],
                    })
                  }
                  value={defaultProfessors}
                />
                <FormLabel htmlFor="capacity" marginTop={"1.5rem"}>
                  Capacity
                </FormLabel>
                <Flex>
                  <NumberInput
                    maxW="100px"
                    mr="2rem"
                    value={courseUpdate.capacity}
                    onChange={(value) =>
                      setCourseUpdate({
                        ...courseUpdate,
                        capacity: parseInt(value),
                      })
                    }
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Slider
                    id="capacity"
                    flex="1"
                    focusThumbOnChange={false}
                    value={courseUpdate.capacity}
                    max={300}
                    onChange={(value) =>
                      setCourseUpdate({
                        ...courseUpdate,
                        capacity: value,
                      })
                    }
                  >
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb
                      fontSize="sm"
                      color="black"
                      boxSize="28px"
                      zIndex={0}
                    >
                      {courseUpdate.capacity.toString()}
                    </SliderThumb>
                  </Slider>
                </Flex>
                {viewState === ViewTypes.table && (
                  <>
                    <FormControl
                      isInvalid={timeError}
                      marginTop={"1.5rem"}
                      isRequired
                    >
                      <FormLabel htmlFor="startDate">Start Date</FormLabel>
                      <DateBox
                        id="startDate"
                        type="date"
                        value={courseUpdate.startDate}
                        onValueChanged={(e) => {
                          setCourseUpdate({
                            ...courseUpdate,
                            startDate: new Date(e.value),
                          });
                        }}
                        isValid={!timeError}
                      />
                      <FormErrorMessage>
                        End Date must come after Start Date
                      </FormErrorMessage>
                    </FormControl>
                    <FormLabel htmlFor="endDate" marginTop={"0.75rem"}>
                      End Date
                    </FormLabel>
                    <DateBox
                      id="endDate"
                      type="date"
                      value={courseUpdate.endDate}
                      onValueChanged={(e) =>
                        setCourseUpdate({
                          ...courseUpdate,
                          endDate: new Date(e.value),
                        })
                      }
                    />
                  </>
                )}
              </FormControl>
            </ModalBody>
            {viewState === ViewTypes.calendar && (
              <ModalHeader>Edit Meeting Time</ModalHeader>
            )}
            <ModalBody>
              <FormControl>
                <FormControl isInvalid={timeError} isRequired>
                  <FormLabel htmlFor="startTime">Start Time</FormLabel>
                  <DateBox
                    id="startTime"
                    type="time"
                    value={courseUpdate.startTime}
                    onValueChanged={(e) => {
                      setCourseUpdate({
                        ...courseUpdate,
                        startTime: new Date(e.value),
                      });
                    }}
                    isValid={!timeError}
                  />
                  <FormErrorMessage>
                    End Time must come after Start Time
                  </FormErrorMessage>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="endTime" marginTop={"0.75rem"}>
                    End Time
                  </FormLabel>
                  <DateBox
                    id="endTime"
                    type="time"
                    value={courseUpdate.endTime}
                    onValueChanged={(e) =>
                      setCourseUpdate({
                        ...courseUpdate,
                        endTime: new Date(e.value),
                      })
                    }
                  />
                </FormControl>
                {viewState === ViewTypes.table ? (
                  <FormControl isInvalid={dayError} marginTop={"0.75rem"}>
                    <Container display="flex" justifyContent="space-between">
                      <Checkbox
                        isChecked={days.includes("MONDAY")}
                        onChange={(e) =>
                          handleCheck(e.target.value, e.target.checked)
                        }
                        value="MONDAY"
                      >
                        Mon
                      </Checkbox>
                      <Checkbox
                        isChecked={days.includes("TUESDAY")}
                        onChange={(e) =>
                          handleCheck(e.target.value, e.target.checked)
                        }
                        value="TUESDAY"
                      >
                        Tues
                      </Checkbox>
                      <Checkbox
                        isChecked={days.includes("WEDNESDAY")}
                        onChange={(e) =>
                          handleCheck(e.target.value, e.target.checked)
                        }
                        value="WEDNESDAY"
                      >
                        Wed
                      </Checkbox>
                      <Checkbox
                        isChecked={days.includes("THURSDAY")}
                        onChange={(e) =>
                          handleCheck(e.target.value, e.target.checked)
                        }
                        value="THURSDAY"
                      >
                        Thurs
                      </Checkbox>
                      <Checkbox
                        isChecked={days.includes("FRIDAY")}
                        onChange={(e) =>
                          handleCheck(e.target.value, e.target.checked)
                        }
                        value="FRIDAY"
                      >
                        Fri
                      </Checkbox>
                    </Container>
                    <FormErrorMessage>
                      Please select at least one day
                    </FormErrorMessage>
                  </FormControl>
                ) : (
                  <FormControl marginTop={"0.75rem"}>
                    <RadioGroup
                      onChange={handleCheck}
                      value={courseUpdate.days[0]}
                    >
                      <Container display="flex" justifyContent="space-between">
                        <Radio value="MONDAY">Mon</Radio>
                        <Radio value="TUESDAY">Tues</Radio>
                        <Radio value="WEDNESDAY">Wed</Radio>
                        <Radio value="THURSDAY">Thurs</Radio>
                        <Radio value="FRIDAY">Fri</Radio>
                      </Container>
                    </RadioGroup>
                  </FormControl>
                )}
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit">
                Confirm
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
