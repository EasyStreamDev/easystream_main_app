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
  const setVolumeToMic = (mics: Mic[]): Promise<resultFormat> => {
		return new Promise(async (resolve, reject) => {
			const result: resultFormat = await ipcRenderer.sendSync('setMicLevel', mics);
			console.log('setVolumeToMic invoke', result);
			resolve(result)
		});
	}

  const getData = (index: number, value: number) => {
    let copy = exampleMicsArray.slice();
    copy[index].level = value;
    console.log("Values", copy);
    setExampleMicsArray(copy);

    // Update to server
    clearTimeout(timeoutCommit)
    timeoutCommit = setTimeout(() => {
      setVolumeToMic(exampleMicsArray)
    }, 3000);
  };


  const setActive = (index: number, value: boolean) => {
    let copy = exampleMicsArray.slice();
    copy[index].isActive = value;
    setExampleMicsArray(copy);

    // Update to server
    clearTimeout(timeoutCommit)
    timeoutCommit = setTimeout(() => {
      setVolumeToMic(exampleMicsArray)
    }, 3000);
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
                key={item.micName}
                isActive={item.isActive}
                name={item.micName}
                value={item.level}
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
