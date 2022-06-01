import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Textarea,
  Tooltip,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { useLoginStore } from "../stores/login";

// these schemas will probably change later, all just example data
const SUBMIT = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
      email
      roles
    }
  }
`;

export const ProfessorSurvey = () => {
  const [smallText, setSmallText] = useState("");
  const [largeText, setLargeText] = useState("");
  const [radioValue, setRadioValue] = useState("");
  const [selectValue, setSelectValue] = useState("");
  const [sliderValue, setSliderValue] = useState(100);
  const [showTooltip, setShowTooltip] = React.useState(false);
  const [submit, { data, loading, error }] = useMutation(SUBMIT);

  const loginState = useLoginStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (loginState.loggedIn) {
      navigate("/");
    }
  }, [loginState.loggedIn, navigate]);

  useEffect(() => {
    if (data && !error && !loading) {
      // TODO: this route will change to whatever the default page is once the
      // user is logged in
      navigate("/");
    }
  }, [data, error, loading, navigate]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    submit({ variables: { smallText, radioValue, sliderValue } });
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
      <Container mb={32} maxW="container.lg">
        <Heading mb={6}>Professor Preferences Survey</Heading>
        <Flex
          bg="#212938"
          p={10}
          borderRadius={10}
          flexDir="column"
          style={{ boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.40)" }}
        >
          <form onSubmit={onSubmit}>
            <FormControl isRequired>
              <FormLabel htmlFor="small_text">Small text box sample</FormLabel>
              <Input
                id="small_text"
                type="text"
                value={smallText}
                onChange={(e) => setSmallText(e.target.value)}
                mb={5}
              />
              <FormLabel htmlFor="radio">Radio buttons sample</FormLabel>
              <RadioGroup
                id="radio"
                onChange={setRadioValue}
                value={radioValue}
                mb={5}
              >
                <Stack direction="row">
                  <Radio value="Willing">Willing</Radio>
                  <Radio value="Able">Able</Radio>
                  <Radio value="Not Able">Not able</Radio>
                </Stack>
              </RadioGroup>
              <FormLabel htmlFor="slider">Slider sample</FormLabel>
              <Slider
                id="slider"
                colorScheme="green"
                defaultValue={100}
                min={0}
                max={200}
                step={1}
                mb={5}
                onChange={(v) => setSliderValue(v)}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <SliderTrack>
                  <Box position="relative" right={10} />
                  <SliderFilledTrack />
                </SliderTrack>
                <Tooltip
                  hasArrow
                  bg="teal.500"
                  color="white"
                  placement="top"
                  isOpen={showTooltip}
                  label={sliderValue}
                >
                  <SliderThumb boxSize={6} />
                </Tooltip>
              </Slider>
              <FormLabel htmlFor="large_text">Large text sample</FormLabel>
              <Textarea
                id="large_text"
                value={largeText}
                onChange={(e) => setLargeText(e.target.value)}
                size="sm"
                mb={5}
              />
              <FormLabel htmlFor="select">Select sample</FormLabel>
              <Select
                id="select"
                value={selectValue}
                mb={5}
                onChange={(e) => setSelectValue(e.target.value)}
              >
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </Select>
              <Button
                isLoading={loading}
                type="submit"
                colorScheme="green"
                variant="solid"
                w="100%"
              >
                Submit
              </Button>
            </FormControl>
            <FormControl isInvalid={error !== undefined}>
              {error !== undefined && (
                <FormErrorMessage mt={5}>{error.message}</FormErrorMessage>
              )}
            </FormControl>
          </form>
        </Flex>
      </Container>
    </Flex>
  );
};
