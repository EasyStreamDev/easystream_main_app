import React from 'react';
import ReactRanger from 'react-ranger'
import CustomizedSlider from '../Slider/Slider'

export const MicsLevel = () => {

  const [exampleMicsArray] = React.useState([
    {
      id: 1,
      name: 'Mic 1',
      level: 0,
      isActive: true,
    },
    {
      id: 2,
      name: 'Mic 2',
      level: 50,
      isActive: true,
    },
    {
      id: 3,
      name: 'Mic 3',
      level: 100,
      isActive: false,
    }
  ]);

  const getData = (index: number, value: number) => {
    exampleMicsArray[index].level = value;
    console.log('Values', exampleMicsArray);
  }

  return (
      <>
        {exampleMicsArray.map((item, index) => {
          return (
            <CustomizedSlider name={item.name} defaultValue={item.level} sendData={ (val: number) => getData(index, val)}/>
          )
        })}
      </>
  )
}