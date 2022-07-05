import React, { useRef, useState } from "react";
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
} from "@chakra-ui/react";
import DateBox from "devextreme-react/date-box";
import { Appointment } from "../../stores/schedule";
import { ViewTypes } from "../../pages/Schedule";

export interface ModalItem extends Appointment {
  days: string[];
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
  const [courseUpdate, setCourseUpdate] = useState(courseData);
  const [error, setError] = useState(false);

  const initialRef = useRef(null);
  const days = courseUpdate.days;

  const handleCheck = (weekDay: string, isChecked: boolean) => {
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
      setError(true);
      return;
    }
    onSubmit(courseUpdate);
    onClose();
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
              <FormLabel htmlFor="code">Course Number</FormLabel>
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
              <FormLabel htmlFor="professors">Professors</FormLabel>
              <Input
                id="professors"
                placeholder="Professors"
                value={courseUpdate.professors.join(" ")}
                onChange={(e) =>
                  setCourseUpdate({
                    ...courseUpdate,
                    professors: [e.target.value],
                  })
                }
              />
              <FormLabel htmlFor="section">Section</FormLabel>
              <Input
                id="section"
                placeholder="Section"
                value={courseUpdate.section}
                onChange={(e) =>
                  setCourseUpdate({ ...courseUpdate, section: e.target.value })
                }
              />
              {viewState === ViewTypes.table && (
                <>
                  <FormControl isInvalid={error}>
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
                      isValid={!error}
                    />
                    <FormErrorMessage>
                      End Date must come after Start Date
                    </FormErrorMessage>
                  </FormControl>
                  <FormLabel htmlFor="endDate">End Date</FormLabel>
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
              <FormControl isInvalid={error}>
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
                  isValid={!error}
                />
                <FormErrorMessage>
                  End Time must come after Start Time
                </FormErrorMessage>
              </FormControl>
              <FormLabel htmlFor="endTime">End Time</FormLabel>
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
              <FormControl display={"flex"} justifyContent={"space-between"}>
                <Checkbox
                  isChecked={days.includes("MON")}
                  onChange={(e) =>
                    handleCheck(e.target.value, e.target.checked)
                  }
                  value="MON"
                >
                  Mon
                </Checkbox>
                <Checkbox
                  isChecked={days.includes("TUE")}
                  onChange={(e) =>
                    handleCheck(e.target.value, e.target.checked)
                  }
                  value="TUE"
                >
                  Tues
                </Checkbox>
                <Checkbox
                  isChecked={days.includes("WED")}
                  onChange={(e) =>
                    handleCheck(e.target.value, e.target.checked)
                  }
                  value="WED"
                >
                  Wed
                </Checkbox>
                <Checkbox
                  isChecked={days.includes("THU")}
                  onChange={(e) =>
                    handleCheck(e.target.value, e.target.checked)
                  }
                  value="THU"
                >
                  Thurs
                </Checkbox>
                <Checkbox
                  isChecked={days.includes("FRI")}
                  onChange={(e) =>
                    handleCheck(e.target.value, e.target.checked)
                  }
                  value="FRI"
                >
                  Fri
                </Checkbox>
              </FormControl>
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
