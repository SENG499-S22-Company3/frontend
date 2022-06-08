import React from "react";
import { Box, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const Card = (props: { description: string; navigateTo: string }) => {
	const navigate = useNavigate();
	
  	return (
	  	<Box bg='white' h='100%' w='15%' p={8} color='black'>
			{props.description}
			<Button 	
        		color='blue.600'
        		onClick={() => {
					navigate(props.navigateTo);
					}}
				>
					Go Here
			</Button>
		</Box>
  	);
};

