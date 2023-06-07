import { Switch } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import CSS from "csstype";

// Define the styles for the box component
const boxStyles: CSS.Properties = {
  border: "solid",
  borderColor: "#FD7014",
  borderWidth: "4",
  paddingLeft: "3vw",
  paddingRight: "3vw",
  paddingTop: "2vh",
  paddingBottom: "2vh",
  backgroundColor: "#222831",
  borderRadius: "15px",
  alignItems: "center",
  cursor: "pointer",
  borderCollapse: "separate",
  borderSpacing: "0 0vh",
  marginBottom: "1vh",
  position: "relative",
  minWidth: "calc(40vw + 231px)",
  maxWidth: "calc(40vw + 231px)",
  lineHeight: 1.6,
};

// Function to be called when the switch is toggled
const toggle = () => {
  console.log("toggle");
};

// Scenes component
export const Scenes = (props: any) => {
  return (
    <>
      {/* Box component with the defined styles */}
      <Box style={boxStyles}>
        <h1>Give EasyStream the possibility to change scenes automatically</h1>
        {/* Switch component with a warning color and the toggle function */}
        <Switch
          color="warning"
          onChange={() => {
            toggle();
          }}
        />
      </Box>
    </>
  );
};
