import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

const marks = [
  {
    value: 0,
    label: "0%"
  },
  {
    value: 20,
    label: "20%"
  },
  {
    value: 40,
    label: "40%"
  },
  {
    value: 60,
    label: "60%"
  },
  {
    value: 80,
    label: "80%"
  },
  {
    value: 100,
    label: "100%"
  }
];

function valuetext(value: number) {
  return `${value}°C`;
}

export default function DiscreteSliderLabel() {
  return (
    <Box sx={{ width: 300 }}>
      <Slider
        aria-label="Always visible"
        defaultValue={80}
        getAriaValueText={valuetext}
        step={1}
        marks={marks}
        valueLabelDisplay="on"
      />
    </Box>
  );
}
