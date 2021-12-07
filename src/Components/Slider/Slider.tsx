import * as React from 'react';
import Slider, { SliderThumb } from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const MicroBoxShadow =
  '0 5px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

const marks = [
  {
    value: 0,
    label: "0",
  },
  {
    value: 20,
    label: "20"
  },
  {
    value: 40,
    label: "40"
  },
  {
    value: 60,
    label: "60"
  },
  {
    value: 80,
    label: "80"
  },
  {
    value: 100,
    label: "100"
  },
];

const MicroSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? '#FD7014' : '#FD7014',
  height: 2,
  padding: '15px 0',
  '& .MuiSlider-thumb': {
    height: 20,
    width: 20,
    backgroundColor: '#eeeeee',
    boxShadow: MicroBoxShadow,
    '&:focus, &:hover, &.Mui-active': {
      boxShadow:
        '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
      '@media (hover: none)': {
        boxShadow: MicroBoxShadow,
      },
    },
  },
  '& .MuiSlider-valueLabel': {
    fontSize: 12,
    fontWeight: 'normal',
    top: -6,
    backgroundColor: 'unset',
    color: theme.palette.text.primary,
    '&:before': {
      display: 'none',
    },
    '& *': {
      background: 'transparent',
      color: theme.palette.mode === 'dark' ? '#eeeeee' : '#eeeeee',
    },
  },
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-rail': {
    opacity: 0.5,
    backgroundColor: '#bfbfbf',
  },
  '& .MuiSlider-mark': {
    backgroundColor: '#bfbfbf',
    height: 8,
    width: 1,
    '&.MuiSlider-markActive': {
      opacity: 1,
      backgroundColor: 'currentColor',
    },
  },
  '& .MuiSlider-markLabel': {
    color: '#eeeeee'
  }
}));

export default function CustomizedSlider(props: any) {

  return (
    <Box sx={{ width: 720 }}>
      <Typography gutterBottom>{ props.name }</Typography>
      <MicroSlider
        onChange={ (_, val: any) => { props.sendData(val)} }
        onChangeCommitted={ (_, val: any) => { props.sendData(val)} }
        aria-label="Micro"
        defaultValue={props.defaultValue}
        marks={marks}
        valueLabelDisplay="on"
        />
    </Box>
  );
}
