import React, { useState, useEffect } from "react";
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
export const SearchBar = (props: SearchBarProps) => {
  const { getTermData, setScheduleData } = props;

  let [searchInput, setSearchInput] = useState("");
  // const [filtered, setFiltered] = useState("");

  const filterLogic = (type?: string, group?: string) => {
    if (group === "course" && type) courseFilter = type;

    if (courseFilter == "all" && searchInput == "") {
      //give full list
      setSearchInput("");
      filterCourses(true);
      return;
    } else if (courseFilter == "all" && searchInput != "") {
      //normal search with text from search input
      filterCourses();
      return;
    } else if (courseFilter != "all" && searchInput == "") {
      //only course filter
      searchInput = courseFilter;
      filterCourses();
      return;
    } else {
      //double filtered with course and searchinput
      filterCourses(false, courseFilter);
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
            onChange={(e) => filterLogic(e.target.value, "course")}
            value="all"
          >
            All
          </Radio>
          <Radio
            onChange={(e) => filterLogic(e.target.value, "course")}
            value="ece"
          >
            ECE
          </Radio>
          <Radio
            onChange={(e) => filterLogic(e.target.value, "course")}
            value="seng"
          >
            SENG
          </Radio>
          <Radio
            onChange={(e) => filterLogic(e.target.value, "course")}
            value="csc"
          >
            CSC
          </Radio>
        </Stack>
      </RadioGroup>

      <InputGroup marginX="2rem">
        <Input
          placeholder="Search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && filterLogic()}
        />
        <InputRightElement>
          {searchInput !== "" ? (
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
              onClick={() => filterLogic()}
            />
          )}
        </InputRightElement>
      </InputGroup>
    </Flex>
  );
};
