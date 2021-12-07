import React from 'react';
import ReactRanger from 'react-ranger'
import CustomizedSlider from '../Slider/Slider'

export const MicsLevel = () => {

  const [arrValues, setValue] = React.useState([50, 20, 70]);

  const getData = (index: number, value: number) => {
    arrValues[index] = value;
    console.log('Values', arrValues);
  }

  return (
      <>
        <CustomizedSlider name={"Mic 1"} defaultValue={ arrValues[0] } sendData={ (val: number) => getData(0, val) } />
        <CustomizedSlider name={"Mic 2"} defaultValue={ arrValues[1] } sendData={ (val: number) => getData(1, val) } />
        <CustomizedSlider name={"Mic 3"} defaultValue={ arrValues[2] } sendData={ (val: number) => getData(2, val) } />
      </>
  )
}