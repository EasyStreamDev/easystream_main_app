import React, { useEffect } from "react";
import CustomizedSlider from "../Slider/Slider";
import { AllMics, Mic } from "../../Socket/interfaces";
import { resultFormat } from "../../Socket/interfaces";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { MdHelpOutline } from "react-icons/md";
import "./CompressorLevel.css";

import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const ipcRenderer = window.require("electron").ipcRenderer;

export const CompressorLevel = () => {
  const [exampleCompressorArray, setExampleCompressorArray] = React.useState<Mic[]>([]);
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

  const getAllCompressors = (): Promise<AllMics> => {
    return new Promise(async (resolve, reject) => {
      const result: AllMics = await ipcRenderer.sendSync("/microphones/get", "ping");
      resolve(result);
    });
  };

  const setVolumeToCompressor = (mic: Mic): Promise<resultFormat> => {
    return new Promise(async (resolve, reject) => {
      const result: resultFormat = await ipcRenderer.sendSync("/microphones/auto-leveler/set", mic);
      console.log("/microphones/auto-leveler/set invoke", result);
      resolve(result);
    });
  };

  const setCompressorValue = (index: number, value: number) => {
    let copy = exampleCompressorArray.slice();
    copy[index].level = value;
    console.log("Value", copy[index]);
    setExampleCompressorArray(copy);

    setVolumeToCompressor(copy[index]);
  };

  const setActive = (index: number, value: boolean) => {
    let copy = exampleCompressorArray.slice();
    copy[index].isActive = value;
    setExampleCompressorArray(copy);

    setVolumeToCompressor(copy[index]);
  };

  useEffect(() => {
    const handleCompressorLevelUpdated = (evt: any, message: any) => {
      getAllCompressors().then((res) => {
        if (res.statusCode === 200) {
          setExampleCompressorArray(res.data.mics);
        }
      });
    };

    ipcRenderer.on("compressor-level-updated", handleCompressorLevelUpdated);

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

    return () => {
      ipcRenderer.removeListener("compressor-level-updated", handleCompressorLevelUpdated);
    };
  }, []);

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
          <div className="container compressor-container">
            <h2 className="margin-title">
              List of mics:
              <Tooltip title="Here, you can adjust the level of compressor applied on your mics. Example: higher is the compressor level, more your voice will be eased.">
                <IconButton>
                  <MdHelpOutline style={{ color: "white" }} />
                </IconButton>
              </Tooltip>
            </h2>
            {exampleCompressorArray.length === 0 ? (
              <>
                <h4>No mic found.</h4>
              </>
            ) : (
              <div className="actions-reactions-list non-dragable">
                <div className="item-container-compressor non-dragable">
                  {exampleCompressorArray && exampleCompressorArray.length > 0 ? (
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
