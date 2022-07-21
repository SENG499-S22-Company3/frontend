import React, { useEffect, useState } from "react";
import { CloseIcon, SearchIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { UserInfo } from "../../stores/profileManagement";

interface SearchBarProps {
  professors: UserInfo[];
  setProfessors: (professors: UserInfo[]) => void;
  allProfessors: UserInfo[];
}

export const SearchBar = (props: SearchBarProps) => {
  const { professors, setProfessors } = props;
  const [searchInput, setSearchInput] = useState("");

  const filterProfessors = () => {
    if (searchInput === "") {
      setProfessors(props.allProfessors);
      return;
    }

    setProfessors(
      professors.filter((prof) =>
        prof.displayName?.toLowerCase().includes(searchInput.toLowerCase())
      )
    );
  };

  useEffect(() => {
    filterProfessors();
  }, [searchInput]);

  return (
    <InputGroup>
      <Input
        placeholder="Search"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <InputRightElement>
        {searchInput !== "" ? (
          <IconButton
            aria-label="Clear search"
            colorScheme={"red"}
            icon={<CloseIcon />}
            onClick={() => {
              setSearchInput("");
            }}
          />
        ) : (
          <IconButton aria-label="Search schedule" icon={<SearchIcon />} />
        )}
      </InputRightElement>
    </InputGroup>
  );
};
