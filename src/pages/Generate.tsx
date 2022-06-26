import React, { useState } from "react";
import {
  Button,
  Container,
  Flex,
  FormLabel,
  Heading,
  Input,
  Select,
  useColorModeValue,
} from "@chakra-ui/react";
import { gql, useMutation } from "@apollo/client";

const GENERATE = gql`
  mutation GenerateSchedule($year: String!, $term: String!) {
    generateSchedule(year: $year, term: $term) {
      year
      term
    }
  }
`;

export const Generate = () => {
  const [submit, { data, loading, error }] = useMutation(GENERATE);
  const [year, setYear] = useState("");
  const [term, setTerm] = useState("");

  const bg = useColorModeValue("gray.50", "gray.700");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    submit({ variables: { year, term } });
    e.preventDefault();
  };
  return (
    <Flex
      w="100%"
      minH="calc(100vh - 5.5rem)"
      pt={30}
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Container
        bg={bg}
        borderRadius={20}
        p={10}
        style={{ boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.40)" }}
        textAlign="center"
      >
        <Heading mb={4}>Generate Schedule</Heading>
        <form onSubmit={onSubmit}>
          <FormLabel htmlFor="year">Year</FormLabel>
          <Select
            placeholder="Select Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            mb={5}
            w="50%"
          >
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </Select>
          <FormLabel htmlFor="term">Term</FormLabel>
          <Select
            placeholder="Select Term"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            mb={5}
            w="50%"
          >
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
            <option value="Fall">Fall</option>
          </Select>
          <FormLabel htmlFor="courses">Courses</FormLabel>
          <Input
            id="courses"
            placeholder="Placeholder for when adding courses ready"
          />
          <Button
            mt={5}
            w="300px"
            colorScheme="purple"
            variant="solid"
            isLoading={loading}
          >
            Generate Schedule
          </Button>
        </form>
      </Container>
    </Flex>
  );
};
