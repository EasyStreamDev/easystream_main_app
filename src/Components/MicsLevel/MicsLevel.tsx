import React, { Component, useEffect, useState } from "react";
import ReactRanger from "react-ranger";
import CustomizedSlider from "../Slider/Slider";
import { AllMics, Mic } from '../../Socket/interfaces';
import { resultFormat } from '../../Socket/interfaces';
const ipcRenderer = window.require('electron').ipcRenderer

export const MicsLevel = () => {
  const [exampleMicsArray, setExampleMicsArray] = React.useState<Mic[]>([]);
  const [load, setload] = React.useState(true);
  const [point, setpoint] = React.useState(".");
  
  let timeoutCommit: NodeJS.Timeout | undefined = undefined;

  const getAllMics = (): Promise<AllMics> => {
		return new Promise(async (resolve, reject) => {
			const result: AllMics = await ipcRenderer.sendSync('getAllMics', 'ping');
			resolve(result);
		})
	}

  // setVolumeToMic('Audio Input Capture (PulseAudio)', 100)
  const setVolumeToMic = (micId: string, value: number): Promise<resultFormat> => {
		return new Promise(async (resolve, reject) => {
			const result: resultFormat = await ipcRenderer.sendSync('setVolumeToMic', {'micId': micId, 'value': value});
			console.log('setVolumeToMic invoke', result);
			resolve(result)
		});
	}

  const commitUpdates = () => {
    // update all mics

    // TODO
    // use ipcRenderer.sendSync('setAutoAudioLeveler', ...)
  }

  const getData = (index: number, value: number) => {
    exampleMicsArray[index].level = value;
    console.log("Values", exampleMicsArray);

    // Set a new timeout that will expire in 3 seconds
    clearTimeout(timeoutCommit);
    timeoutCommit = setTimeout(commitUpdates, 3000);
  };


  const setActive = (index: number, value: boolean) => {
    let copy = exampleMicsArray.slice();
    copy[index].isActive = value;
    setExampleMicsArray(copy);

    // Set a new timeout that will expire in 3 seconds
    clearTimeout(timeoutCommit);
    timeoutCommit = setTimeout(commitUpdates, 3000);
  };

  useEffect(() => {
    async function sleep(): Promise<boolean> {
      return new Promise((resolve) => {
        getAllMics()
        .then(res => {
          if (res.statusCode === 200) {
            setExampleMicsArray(res.mics)
            resolve(false);
          }
        })
      })
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
        exampleMicsArray && exampleMicsArray.length > 0 ? (
          exampleMicsArray.map((item, index) => {
            return (
              <CustomizedSlider
                key={item.name}
                isActive={item.isActive}
                name={item.name}
                defaultValue={item.level}
                sendData={(val: number) => getData(index, val)}
                sendActive={(val: boolean) => setActive(index, val)}
              />
            );
          })
        ) : (
          <></>
        )
      )}
    </>
  );
};
