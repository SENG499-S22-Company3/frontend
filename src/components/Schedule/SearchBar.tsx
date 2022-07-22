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
  filter,
} from "@chakra-ui/react";
import { CourseSection } from "../../stores/schedule";

interface SearchBarProps {
  getTermData: () => CourseSection[] | undefined;
  setScheduleData: (data: CourseSection[]) => void;
}
var courseFilter = "all";

export const SearchBar = (props: SearchBarProps) => {
  const { getTermData, setScheduleData } = props;

  const [searchInput, setSearchInput] = useState("");

  const [filtered, setFiltered] = useState("");

  const filterCourses = (clear?: boolean) => {
    const termData = getTermData();
    if (!termData) return;

    if (clear) {
      if (courseFilter === "all") {
        setFiltered("");
        setScheduleData(termData);
        return;
      } else {
        filter2(termData);
        return;
      }
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
    if (courseFilter === "all") setScheduleData(filteredAppointments);
    else filter2(filteredAppointments);
  };

  const setFilter = (type: string) => {
    courseFilter = type;
    filterCourses(false);
  };

  const filter2 = (td: CourseSection[]) => {
    const termData = td;
    if (!termData) return;

    //checks if every word of the search exists as an attribute for the course
    const inputWords = courseFilter;
    const filteredAppointments = termData.filter((course) => {
      const courseProperties = Object.values(course.CourseID);
      const courseProfessors = course.professors.map(
        (prof) => prof.displayName
      );

      let appointmentValues = "";
      [...courseProperties, ...courseProfessors].forEach(
        (value) => (appointmentValues += value.toLowerCase())
      );
      return appointmentValues.includes(inputWords);
    });
    setFiltered(searchInput);
    setScheduleData(filteredAppointments);
  };

  return (
    <>
      <RadioGroup id="course_type"  defaultValue={"all"}>
        <Stack direction="row">
          <Radio  colorScheme="blue" onChange={(e) => setFilter(e.target.value)} value="all">
            All
          </Radio>
          <Radio  colorScheme='green' onChange={(e) => setFilter(e.target.value)} value="ece">
            ECE
          </Radio>
          <Radio   colorScheme='yellow' onChange={(e) => setFilter(e.target.value)} value="seng">
            SENG
          </Radio>
          <Radio  colorScheme='red' onChange={(e) => setFilter(e.target.value)} value="csc">
            CSC
          </Radio>
          <Radio  colorScheme='purple' onChange={(e) => setFilter(e.target.value)} value="summer">
            Summer
          </Radio>
          <Radio  colorScheme='pink' onChange={(e) => setFilter(e.target.value)} value="fall">
            Fall
          </Radio>
          <Radio  colorScheme='teal' onChange={(e) => setFilter(e.target.value)} value="spring">
            Spring
          </Radio>
        </Stack>
      </RadioGroup>
      <Flex alignItems="center" justifyContent="space-between">
        <InputGroup marginX="1rem" title="Search schedule">
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
    </>
  );
};
