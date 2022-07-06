import {
  Container,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  ListItem,
  List,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { UnlockIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import { SurveyDetailedResults } from "../components/SurveyDetailedResults";

export const SurveyResults = () => {
  //Test data to remove later
  const tableData = [
    {
      professor: "Professor A",
      preferences: [
        "SENG 499: Willing",
        "SENG 440: Not Able",
        "SENG 426: Able",
      ],
      nonTeachingTerm1: "Fall",
      nonTeachingTerm2: "Summer",
      relief: "No",
      reliefExplanation: "None",
      studyLeave: "Yes",
      studyExplanation: "I Need a break",
      topics: "Yes",
      topicsCourse: "SENG 485C",
      topicDescription: "Creativity and design tools",
    },
    {
      professor: "Professor B",
      preferences: [
        "SENG 499: Willing",
        "SENG 440: Not Able",
        "SENG 426: Able",
      ],
      nonTeachingTerm1: "Fall",
      nonTeachingTerm2: "Summer",
      relief: "No",
      reliefExplanation: "None",
      studyLeave: "Yes",
      studyExplanation: "I Need a break",
      topics: "Yes",
      topicsCourse: "SENG 485C",
      topicDescription: "Creativity and design tools",
    },
    {
      professor: "Professor C",
      preferences: [
        "SENG 499: Willing",
        "SENG 440: Not Able",
        "SENG 426: Able",
      ],
      nonTeachingTerm1: "Fall",
      nonTeachingTerm2: "Summer",
      relief: "No",
      reliefExplanation: "None",
      studyLeave: "Yes",
      studyExplanation: "I Need a break",
      topics: "Yes",
      topicsCourse: "SENG 485C",
      topicDescription: "Creativity and design tools",
    },
    {
      professor: "Professor D",
      preferences: [
        "SENG 499: Willing",
        "SENG 440: Not Able",
        "SENG 426: Able",
      ],
      nonTeachingTerm1: "Fall",
      nonTeachingTerm2: "Summer",
      relief: "No",
      reliefExplanation: "None",
      studyLeave: "Yes",
      studyExplanation: "I Need a break",
      topics: "Yes",
      topicsCourse: "SENG 485C",
      topicDescription: "Creativity and design tools",
    },
    {
      professor: "Professor E",
      preferences: [
        "SENG 499: Willing",
        "SENG 440: Not Able",
        "SENG 426: Able",
      ],
      nonTeachingTerm1: "Fall",
      nonTeachingTerm2: "Summer",
      relief: "No",
      reliefExplanation: "None",
      studyLeave: "Yes",
      studyExplanation: "I Need a break",
      topics: "Yes",
      topicsCourse: "SENG 485C",
      topicDescription: "Creativity and design tools",
    },
  ];

  const reopenForm = (item: Object) => {
    console.log(item);
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
      <Container maxW="container.xl">
        <Heading mb={6}>Professor Preferences Survey Results</Heading>
        <Flex
          p={10}
          borderRadius={10}
          flexDir="column"
          style={{ boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.40)" }}
        >
          <Table variant="striped" size="md">
            <Thead>
              <Tr>
                <Th>Professor</Th>
                <Th>Teaching Preferences</Th>
                <Th>Non-Teaching Term 1</Th>
                <Th>Non-Teaching Term 2</Th>
                <Th>More Details</Th>
                <Td>Reopen Survey</Td>
              </Tr>
            </Thead>
            <Tbody>
              {tableData.map((item) => (
                <Tr key={item.professor}>
                  <Td>{item.professor}</Td>
                  <Td>
                    <List>
                      {item.preferences.map((course) => (
                        <ListItem key={course}>{course}</ListItem>
                      ))}
                    </List>
                  </Td>
                  <Td>{item.nonTeachingTerm1}</Td>
                  <Td>{item.nonTeachingTerm2}</Td>
                  <Td>
                    <SurveyDetailedResults {...item} />
                  </Td>
                  <Td>
                    <IconButton
                      colorScheme="green"
                      aria-label="Reopen Survey"
                      icon={<UnlockIcon />}
                      onClick={() => reopenForm(item)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Flex>
      </Container>
    </Flex>
  );
};
