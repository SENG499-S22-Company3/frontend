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
var courseFilter = "all";
var termFilter = "all";
export const SearchBar = (props: SearchBarProps) => {
  const { getTermData, setScheduleData } = props;

  let [searchInput, setSearchInput] = useState("");
  const [filtered, setFiltered] = useState("");

  const toggleCourseTypes = (type: string, group: string) => {
    if (group === "course") courseFilter = type;
    else termFilter = type;

    if (courseFilter == "all" && termFilter == "all") {
      //both are all so give full list
      setSearchInput("");
      filterCourses(true);
      return;
    } else if (type == "all") {
      //all just selected, find out which group
      if (group === "course") searchInput = termFilter;
      else searchInput = courseFilter;
      filterCourses();
      return;
    } else if (courseFilter == "all" || termFilter == "all") {
      //only one filter
      searchInput = type;
      filterCourses();
      return;
    } else {
      //double filtered
      searchInput = courseFilter;
      filterCourses(false, termFilter);
      return;
    }
  };

  const filterCourses = (
    clear?: boolean,
    next?: string,
    td?: CourseSection[]
  ) => {
    let termData;
    if (td) termData = td;
    else termData = getTermData();

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
    if (!next || next == "") {
      //single filter
      setFiltered(searchInput);
      setScheduleData(filteredAppointments);
    } else {
      //double filter present, run again
      searchInput = next;
      filterCourses(false, "", filteredAppointments);
    }
  };

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <FormLabel htmlFor="course_type" mt={1}>
        Course:
      </FormLabel>
      <RadioGroup id="course_type" colorScheme="green" defaultValue={"all"}>
        <Stack direction="row">
          <Radio
            onChange={(e) => toggleCourseTypes(e.target.value, "course")}
            value="all"
          >
            All
          </Radio>
          <Radio
            onChange={(e) => toggleCourseTypes(e.target.value, "course")}
            value="ece"
          >
            ECE
          </Radio>
          <Radio
            onChange={(e) => toggleCourseTypes(e.target.value, "course")}
            value="seng"
          >
            SENG
          </Radio>
          <Radio
            onChange={(e) => toggleCourseTypes(e.target.value, "course")}
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
            onChange={(e) => toggleCourseTypes(e.target.value, "term")}
            value="all"
          >
            All
          </Radio>
          <Radio
            onChange={(e) => toggleCourseTypes(e.target.value, "term")}
            value="summer"
          >
            Summer
          </Radio>
          <Radio
            onChange={(e) => toggleCourseTypes(e.target.value, "term")}
            value="fall"
          >
            Fall
          </Radio>
          <Radio
            onChange={(e) => toggleCourseTypes(e.target.value, "term")}
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
