import React, { useState } from "react";
import { CloseIcon, SearchIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { Course } from "../../stores/schedule";

interface SearchBarProps {
  termData: Course[];
  setScheduleData: (data: Course[]) => void;
}

export const SearchBar = (props: SearchBarProps) => {
  const { termData, setScheduleData } = props;

  const [searchInput, setSearchInput] = useState("");
  const [filtered, setFiltered] = useState("");

  const filterCourses = (clear?: boolean) => {
    if (searchInput === "" || clear) {
      setFiltered("");
      return setScheduleData(termData);
    }

    //checks if every word of the search exists as an attribute for the course
    const inputWords = searchInput.toLowerCase().split(" ");
    const filteredAppointments = termData.filter(
      ({ meetingTime, ...appointment }) => {
        let appointmentValues = "";
        Object.values(appointment).forEach(
          (value) => (appointmentValues += value.toLowerCase())
        );
        return inputWords.every((word) => appointmentValues.includes(word));
      }
    );
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
