import React, { Component, useEffect, useState } from "react";
import ReactRanger from "react-ranger";
import CustomizedSlider from "../Slider/Slider";

export const MicsLevel = () => {
  const [exampleMicsArray, setExampleMicsArray] = React.useState([
    {
      id: 1,
      name: "Mic 1",
      level: 0,
      savedlevel: 0,
      isActive: true,
    },
    {
      id: 2,
      name: "Mic 2",
      level: 50,
      savedlevel: 50,
      isActive: true,
    },
    {
      id: 3,
      name: "Mic 3",
      level: 100,
      savedlevel: 100,
      isActive: false,
    },
  ]);

  const [load, setload] = React.useState(true);
  const [point, setpoint] = React.useState(".");


  const getData = (index: number, value: number) => {
    exampleMicsArray[index].level = value;
    console.log("Values", exampleMicsArray);
  };

  const setActive = (index: number, value: boolean) => {
    let copy = exampleMicsArray.slice();
    copy[index].isActive = value;
    setExampleMicsArray(copy);
  };

  useEffect(() => {
    async function sleep(): Promise<boolean> {
      await delay(4000);
      return !load;
    }
    
    sleep().then((res) => setload(res));
  }, []);

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function addpoint() {
    {setInterval(() => {
      (point.length >= 3 ? setpoint(".") : setpoint(point + "."));
    }, 1000)}
  }

  return (
    <>
      {load ? (
        <>
          <h1>Easystream is loading</h1>
          <h1>{point}</h1>
          {addpoint()}
        </>
      ) : (
        exampleMicsArray.map((item, index) => {
          return (
            <CustomizedSlider
              key={item.id}
              isActive={item.isActive}
              name={item.name}
              defaultValue={item.savedlevel}
              sendData={(val: number) => getData(index, val)}
              sendActive={(val: boolean) => setActive(index, val)}
            />
          );
        })
      )}
    </>
  );
};
