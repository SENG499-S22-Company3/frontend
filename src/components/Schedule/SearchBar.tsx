import React, { useState } from "react";
import { CloseIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Flex,
  Box,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { CourseSection } from "../../stores/schedule";
import { Text } from "devextreme-react/linear-gauge";
// import { RadioGroup } from "devextreme-react";

interface SearchBarProps {
  getTermData: () => CourseSection[] | undefined;
  setScheduleData: (data: CourseSection[]) => void;
}

export const SearchBar = (props: SearchBarProps) => {
  const { getTermData, setScheduleData } = props;

  let [searchInput, setSearchInput] = useState("");
  const [filtered, setFiltered] = useState("");

  const toggleCourseTypes = (type: string) => {
    if (type === "all") {
      setSearchInput("");
      filterCourses(true);
      return;
    } else {
      searchInput = type;
      filterCourses();
      return;
    }
  };

  const filterCourses = (clear?: boolean) => {
    const termData = getTermData();
    if (!termData) return;

    if (searchInput === "" || clear) {
      setFiltered("");
      setScheduleData(termData);
      return;
    }

    //checks if every word of the search exists as an attribute for the course
    const inputWords = searchInput.toLowerCase().split(" ");
    const filteredAppointments = termData.filter((course) => {
      const courseProperties = Object.values(course.CourseID);
      const courseProfessors = course.professors.map(
        (prof) => prof.displayName
      );

      let appointmentValues = "";
      [...courseProperties, ...courseProfessors].forEach(
        (value) => (appointmentValues += value.toLowerCase())
      );
      return inputWords.every((word) => appointmentValues.includes(word));
    });
    setFiltered(searchInput);
    setScheduleData(filteredAppointments);
  };

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <FormLabel htmlFor="course_type" mt={1}>
        Course:
      </FormLabel>
      <RadioGroup id="course_type" colorScheme="green" defaultValue={"all"}>
        <Stack direction="row">
          <Radio
            onChange={(e) => toggleCourseTypes(e.target.value)}
            value="all"
          >
            All
          </Radio>
          <Radio
            onChange={(e) => toggleCourseTypes(e.target.value)}
            value="ece"
          >
            ECE
          </Radio>
          <Radio
            onChange={(e) => toggleCourseTypes(e.target.value)}
            value="seng"
          >
            SENG
          </Radio>
          <Radio
            onChange={(e) => toggleCourseTypes(e.target.value)}
            value="csc"
          >
            CSC
          </Radio>
        </Stack>
      </RadioGroup>

      <FormLabel htmlFor="term" mt={1} ml={10}>
        Term:
      </FormLabel>
      <RadioGroup id="term" colorScheme="blue" defaultValue={"all"}>
        <Stack direction="row">
          <Radio
            onChange={(e) => toggleCourseTypes(e.target.value)}
            value="all"
          >
            All
          </Radio>
          <Radio
            onChange={(e) => toggleCourseTypes(e.target.value)}
            value="summer"
          >
            Summer
          </Radio>
          <Radio
            onChange={(e) => toggleCourseTypes(e.target.value)}
            value="fall"
          >
            Fall
          </Radio>
          <Radio
            onChange={(e) => toggleCourseTypes(e.target.value)}
            value="spring"
          >
            Spring
          </Radio>
        </Stack>
      </RadioGroup>

      <InputGroup marginX="2rem">
        <Input
          placeholder="Search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && filterCourses()}
        />
        <InputRightElement>
          {searchInput !== "" && filtered === searchInput ? (
            <IconButton
              aria-label="Clear search"
              colorScheme={"red"}
              icon={<CloseIcon />}
              onClick={() => {
                setSearchInput("");
                filterCourses(true);
              }}
            />
          ) : (
            <IconButton
              aria-label="Search schedule"
              icon={<SearchIcon />}
              onClick={() => filterCourses()}
            />
          )}
        </InputRightElement>
      </InputGroup>
    </Flex>
  );
};
