import { ipcRenderer } from "electron";
import React, { Component, useEffect, useState } from "react";
import ReactRanger from "react-ranger";
import { AllMics, Mic } from "../../Socket/interfaces";
import CustomizedSlider from "../Slider/Slider";

export const MicsLevel = () => {
  const [exampleMicsArray, setExampleMicsArray] = React.useState<Mic[]>([]);

  const [load, setload] = React.useState(true);
  const [point, setpoint] = React.useState(".");


  const getData = (index: number, value: number) => {
    exampleMicsArray[index].value = value;
    console.log("Values", exampleMicsArray);
  };

  const setActive = (index: number, value: boolean) => {
    let copy = exampleMicsArray.slice();
    copy[index].isActive = value;
    setExampleMicsArray(copy);
  };

  const getAllMics = (): Promise<AllMics> => {
		return new Promise(async (resolve, reject) => {
			const result: AllMics = await ipcRenderer.sendSync('getAllMics', 'ping');
			console.log('getAllMics invoke', result);
			resolve(result);
		})
	}

  useEffect(() => {
    async function GetAllMics(): Promise<Mic[]> {
      const micsGet: Mic[] = (await getAllMics()).mics
      setload(!load)
      return micsGet;
    }
    
    GetAllMics().then((res) => setExampleMicsArray(res));
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
              key={index}
              isActive={item.isActive}
              name={item.micName}
              defaultValue={item.value}
              sendData={(val: number) => getData(index, val)}
              sendActive={(val: boolean) => setActive(index, val)}
            />
          );
        })
      )}
    </>
  );
};
