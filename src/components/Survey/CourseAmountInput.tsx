import {
  Flex,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
} from "@chakra-ui/react";
import React from "react";

interface ChildProps {
  title: string;
  max: number;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
}

export const CourseAmountInput: React.FC<ChildProps> = (props) => {
  const handleChange = (valueAsString: string, valueAsNum: number) => {
    props.setAmount(valueAsNum);
  };

  return (
    <Flex direction="column">
      <Text>{props.title}</Text>
      <NumberInput
        w={100}
        defaultValue={0}
        max={props.max}
        min={0}
        onChange={handleChange}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </Flex>
  );
};
