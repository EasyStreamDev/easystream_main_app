import React, { Component, useEffect, useState } from "react";
import ReactRanger from "react-ranger";
import CustomizedSlider from "../Slider/Slider";
import { AllMics, Mic } from "../../Socket/interfaces";
import { resultFormat } from "../../Socket/interfaces";
import { Button } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { MdHelpOutline } from "react-icons/md";
import "./CompressorLevel.css";

import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const ipcRenderer = window.require("electron").ipcRenderer;
const SAVE_MICROPHONE_URL = "/applicationSavedFeature/saveMicrophones";

export const CompressorLevel = () => {
  const [exampleCompressorArray, setExampleCompressorArray] = React.useState<
    Mic[]
  >([]);
  const [load, setload] = React.useState(true);
  const [point, setpoint] = React.useState(".");
  const axiosPrivate = useAxiosPrivate();

  const style = {
    Button: {
      borderColor: "#f56f28",
      color: "#FFFFFF",
      marginTop: "20px",
      "&:hover": {
        borderColor: "#f56f28",
        color: "#f56f28",
      },
    },
  };

  let timeoutCommit: NodeJS.Timeout | undefined = undefined;

  const getAllCompressors = (): Promise<AllMics> => {
    return new Promise(async (resolve, reject) => {
      const result: AllMics = await ipcRenderer.sendSync("getAllMics", "ping");
      resolve(result);
    });
  };

  const setVolumeToCompressor = (mic: Mic): Promise<resultFormat> => {
    return new Promise(async (resolve, reject) => {
      const result: resultFormat = await ipcRenderer.sendSync(
        "setMicLevel",
        mic
      );
      console.log("setVolumeToCompressor invoke", result);
      resolve(result);
    });
  };

  const setCompressorValue = (index: number, value: number) => {
    let copy = exampleCompressorArray.slice();
    copy[index].level = value;
    console.log("Value", copy[index]);
    setExampleCompressorArray(copy);

    // // Update to server
    // clearTimeout(timeoutCommit);
    // timeoutCommit = setTimeout(() => {
    setVolumeToCompressor(copy[index]);
    // }, 3000);
  };

  const setActive = (index: number, value: boolean) => {
    let copy = exampleCompressorArray.slice();
    copy[index].isActive = value;
    setExampleCompressorArray(copy);

    // // Update to server
    // clearTimeout(timeoutCommit);
    // timeoutCommit = setTimeout(() => {
      setVolumeToCompressor(copy[index]);
    // }, 3000);
  };

  useEffect(() => {
    async function sleep(): Promise<boolean> {
      return new Promise((resolve) => {
        getAllCompressors().then((res) => {
          if (res.statusCode === 200) {
            setExampleCompressorArray(res.data.mics);
            resolve(false);
          }
        });
      });
    }

    sleep().then((res) => setload(res));
  }, []);

  function addpoint() {
    {
      setInterval(() => {
        point.length >= 3 ? setpoint(".") : setpoint(point + ".");
      }, 1000);
    }
  }

  const save = () => {
    const mics = [...exampleCompressorArray];
    axiosPrivate.post(SAVE_MICROPHONE_URL, {
      mics,
      headers: { "Content-Type": "application/json" },
      // withCredentials: true,
    });
  };

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
          <div className="container events-container">
            <h2>List of mics:
            <Tooltip title="Here, you can adjust the level of compressor applied on your mics. Example: higher is the compressor level, more your voice will be eased.">
              <IconButton>
                <MdHelpOutline style={ { color: "white" } } />
              </IconButton>
            </Tooltip>
            </h2>
            {exampleCompressorArray.length === 0 ? (
              <>
                <h4>No mic found.</h4>
              </>
            ) : (
              <div className="actions-reactions-list">
                <div className="item-container">
                  {exampleCompressorArray &&
                  exampleCompressorArray.length > 0 ? (
                    exampleCompressorArray.map((item, index) => {
                      return (
                        <CustomizedSlider
                          key={item.micName}
                          isActive={item.isActive}
                          name={item.micName}
                          value={item.level}
                          sendData={(val: number) => setCompressorValue(index, val)}
                          sendActive={(val: boolean) => setActive(index, val)}
                        />
                      );
                    })
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};
