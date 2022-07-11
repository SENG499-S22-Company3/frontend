import React, { useState } from "react";
import { CloseIcon, SearchIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { CourseSection } from "../../stores/schedule";

interface SearchBarProps {
  getTermData: () => CourseSection[] | undefined;
  setScheduleData: (data: CourseSection[]) => void;
}

export const SearchBar = (props: SearchBarProps) => {
  const { getTermData, setScheduleData } = props;

  const [searchInput, setSearchInput] = useState("");
  const [filtered, setFiltered] = useState("");

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
      // const courseProfessors = course.professors.map(
      //   (prof) => prof.displayName
      // );
      const courseProfessors = ["Joe Biden"];
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
  );
};
