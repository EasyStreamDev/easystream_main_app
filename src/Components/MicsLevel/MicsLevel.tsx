import { Button } from "@mui/material";
import React, { Component, useEffect, useState } from "react";
import ReactRanger from "react-ranger";
import { AllMics, Mic, resultFormat } from "../../Socket/interfaces";
import CustomizedSlider from "../Slider/Slider";
let { ipcRenderer } = window.require("electron");

export const MicsLevel = () => {
  const [exampleMicsArray, setExampleMicsArray] = React.useState<Mic[]>([]);

  const [load, setload] = React.useState(true);
  const [point, setpoint] = React.useState(".");

  const getData = (index: number, value: number, event:any) => {
    if (event)
    console.log(event)
    if (event && event.type === "mousedown") {
      console.log("teazefvqhkgqu")
    }
    exampleMicsArray[index].value = value;
  };

  const setActive = (index: number, value: boolean) => {
    let copy = exampleMicsArray.slice();
    copy[index].isActive = value;
    setExampleMicsArray(copy);
  };

  const getAllMics = async (): Promise<AllMics> => {
    return new Promise(async (resolve, reject) => {
      const result: AllMics = await ipcRenderer.sendSync("getAllMics", "ping");
      console.log("getAllMics invoke", result);
      resolve(result);
    });
  };

  useEffect(() => {
    async function connectAllMicsWithTCP(): Promise<Mic[]> {
      const micsGet: Mic[] = (await getAllMics()).mics;
      setload(!load);
      console.log(micsGet);
      return micsGet;
    }

    connectAllMicsWithTCP().then((res) => setExampleMicsArray(res));
  }, []);

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function addpoint() {
    {
      setInterval(() => {
        point.length >= 3 ? setpoint(".") : setpoint(point + ".");
      }, 1000);
    }
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
        <>
          {exampleMicsArray.map((item, index) => {
            return (
              <CustomizedSlider
                key={index}
                isActive={item.isActive}
                name={item.micName}
                defaultValue={item.value}
                value={item.value}
                sendData={(val: number, event:any) => getData(index, val, event)}
                sendActive={(val: boolean) => setActive(index, val)}
              />
            );
          })}
        </>
      )}
    </>
  );
};
