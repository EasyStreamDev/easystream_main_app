import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import { BsMic, BsMicMute } from "react-icons/bs";
import { styled } from "@mui/material/styles";

const MicroBoxShadow = "0 5px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)";

const marks = [
  {
    value: 0,
    label: "0",
  },
  {
    value: 20,
    label: "20",
  },
  {
    value: 40,
    label: "40",
  },
  {
    value: 60,
    label: "60",
  },
  {
    value: 80,
    label: "80",
  },
  {
    value: 100,
    label: "100",
  },
];

const MicroSlider = styled(Slider)(() => ({
  color: "orange",
  height: 2,
  padding: "15px 0",
  "& .MuiSlider-thumb": {
    height: 20,
    width: 20,
    backgroundColor: "#eeeeee",
    boxShadow: MicroBoxShadow,
    "&:focus, &:hover, &.Mui-active": {
      boxShadow: "0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)",
      "@media (hover: none)": {
        boxShadow: MicroBoxShadow,
      },
    },
  },
  "& .MuiSlider-valueLabel": {
    fontSize: 12,
    fontWeight: "normal",
    top: -6,
    backgroundColor: "unset",
    color: "white",
    "&:before": {
      display: "none",
    },
    "& *": {
      background: "transparent",
      color: "#eeeeee",
    },
  },
  "& .MuiSlider-track": {
    color: "orange",
    border: "none",
  },
  "& .MuiSlider-rail": {
    opacity: 0.5,
    backgroundColor: "#bfbfbf",
  },
  "& .MuiSlider-mark": {
    backgroundColor: "orange",
    height: 8,
    width: 1,
    "&.MuiSlider-markActive": {
      opacity: 1,
      color: "orange",
      backgroundColor: "currentColor",
    },
  },
  "& .MuiSlider-markLabel": {
    color: "#eeeeee",
  },
}));

const CustomizedSlider = (props: any) => {
  const handleSliderChange = (_: any, value: any) => {
    props.sendData(value);
  };

  const handleMicToggle = () => {
    props.sendActive(!props.isActive);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ pt: 4, pb: 4 }}>
        <Typography gutterBottom>{props.name}</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
          p: 1,
          m: 1,
        }}
      >
        <Box sx={{ width: "65vw" }}>
          <MicroSlider
            key={props.key}
            onChangeCommitted={handleSliderChange}
            aria-label="Micro"
            value={props.value ?? 0}
            marks={marks}
            valueLabelDisplay="on"
          />
        </Box>
        <Box
          sx={{ marginTop: "-20px" }}
          onClick={handleMicToggle}
          style={{ color: props.isActive ? "green" : "orange" }}
        >
          {props.isActive ? <BsMic /> : <BsMicMute />}
        </Box>
      </Box>
    </Box>
  );
};

export default CustomizedSlider;
