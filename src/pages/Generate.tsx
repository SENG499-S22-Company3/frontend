import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Flex,
  FormLabel,
  Heading,
  Input,
  Select,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const GENERATE = gql`
  mutation generate($input: GenerateScheduleInput!) {
    generateSchedule(input: $input) {
      message
      success
    }
  }
`;

export const Generate = () => {
  const [generate, { data, loading, error }] = useMutation(GENERATE);
  const navigate = useNavigate();
  const [year, setYear] = useState("");
  const [term, setTerm] = useState("");

  const bg = useColorModeValue("gray.50", "gray.700");

  const toast = useToast();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = {
      year: Number(year),
    };
    generate({ variables: { input } });
  };

  useEffect(() => {
    if (!loading) {
      if (data && !error) {
        if (data.generateSchedule.success) {
          navigate("/schedule");
        } else {
          console.log(data);
          toast({
            title: "Failed to Generate Schedule",
            description: data.generateSchedule.message,
            status: "error",
            isClosable: true,
          });
        }
      } else if (error) {
        console.log(error);
        toast({
          title: "Failed to Generate Schedule",
          description: error.message,
          status: "error",
          isClosable: true,
        });
      }
    }
  }, [data, loading, error]);

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
            type="submit"
            isLoading={loading}
          >
            Generate Schedule
          </Button>
        </form>
      </Container>
    </Flex>
  );
};
