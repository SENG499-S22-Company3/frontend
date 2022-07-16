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
import { Appointment } from "../../stores/schedule";
import { ViewTypes } from "../../pages/Schedule";
import { gql, useQuery } from "@apollo/client";
import {
  Select,
  OptionBase,
  GroupBase,
  MultiValue,
  ActionMeta,
} from "chakra-react-select";

const USERS = gql`
  query getUsers {
    allUsers {
      displayName
    }
  }
`;

interface ProfessorOption extends OptionBase {
  label: string;
  value: string;
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

  const { data, loading, error } = useQuery(USERS);
  const [professorOptions, setProfessorOptions] = useState<ProfessorOption[]>();
  const [courseUpdate, setCourseUpdate] = useState(courseData);
  const [timeError, setTimeError] = useState(false);
  const [dayError, setDayError] = useState(false);

  const defaultProfessors: ProfessorOption[] = courseUpdate.professors.map(
    (prof) => {
      return {
        label: prof,
        value: prof,
      };
    }
  );
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
        console.log(profNames);
        setProfessorOptions(profNames);
      } else {
        console.log(error);
      }
    }
  }, [data, error, loading]);

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

  const handleSubmit = () => {
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

  const handleProfessorChange = (
    professors: MultiValue<ProfessorOption>,
    actionMeta: ActionMeta<ProfessorOption>
  ) => {
    const newProfName = actionMeta.option?.value || "";
    const removedProfName = actionMeta.removedValue?.value || "";
    if (actionMeta.action === "select-option") {
      if (actionMeta.option) {
        const newProfessors = [...courseUpdate.professors, newProfName];
        setCourseUpdate({ ...courseUpdate, professors: newProfessors });
      }
    } else if (actionMeta.action === "remove-value") {
      if (actionMeta.removedValue) {
        const newProfessors = courseUpdate.professors.filter((prof) => {
          return prof !== removedProfName;
        });
        setCourseUpdate({ ...courseUpdate, professors: newProfessors });
      }
    } else if (actionMeta.action === "clear") {
      setCourseUpdate({ ...courseUpdate, professors: [] });
    }
  };

  return (
    <>
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Course</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel htmlFor="subject">Course Subject</FormLabel>
              <Input
                id="subject"
                ref={initialRef}
                placeholder="Subject"
                value={courseUpdate?.subject}
                onChange={(e) =>
                  setCourseUpdate({ ...courseUpdate, subject: e.target.value })
                }
              />
              <FormLabel htmlFor="code" marginTop={"0.75rem"}>
                Course Number
              </FormLabel>
              <Input
                id="code"
                placeholder="Number"
                value={courseUpdate.code}
                onChange={(e) =>
                  setCourseUpdate({
                    ...courseUpdate,
                    code: e.target.value,
                  })
                }
              />
              <FormLabel htmlFor="professors" marginTop={"0.75rem"}>
                Professors
              </FormLabel>
              <Select<ProfessorOption, true, GroupBase<ProfessorOption>>
                isMulti
                name="professors"
                options={professorOptions}
                placeholder="Professors"
                onChange={handleProfessorChange}
                value={defaultProfessors}
              />
              <FormLabel htmlFor="capacity" marginTop={"0.75rem"}>
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
                  <FormControl isInvalid={timeError} marginTop={"0.75rem"}>
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
              <FormControl isInvalid={timeError}>
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
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Confirm
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
