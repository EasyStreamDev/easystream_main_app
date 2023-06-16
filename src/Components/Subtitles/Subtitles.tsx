import { Switch } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import CSS from 'csstype';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { languages } from "../Language/LanguageData";
import Grid from '@mui/material/Grid';
import { LocalStorage } from "../../LocalStorage/LocalStorage";
import { resultFormat } from "../../Socket/interfaces";
import { toast } from "react-toastify";
const ipcRenderer = window.require('electron').ipcRenderer

export const Subtitles = () => {

  const boxStyles: CSS.Properties = {
    border: "solid",
    borderColor: "#FD7014",
    borderWidth: "4",
    paddingLeft: "3vw",
    paddingRight: "3vw",
    paddingTop: "2vh",
    paddingBottom: "2vh",
    backgroundColor: "#222831",
    borderRadius: "15px",
    alignItems: "center",
    cursor: "pointer",
    borderCollapse: "separate",
    borderSpacing: "0 0vh",
    marginBottom: "1vh",
    position: "relative",
    minWidth: "calc(40vw + 231px)",
    maxWidth: "calc(40vw + 231px)",
    lineHeight: 1.6,
    justifyContent: "center",
  };

  const itemStyles: CSS.Properties = {
    padding: "25px !important",
    justifyContent: "center",
    alignItems: "center"
  };

  // Loading
  const [load, setload] = React.useState(true);
  const [point, setpoint] = React.useState(".");

  const [subtitlesActivated, setSubtitlesActivated] = React.useState(LocalStorage.getItemObject("subtitlesActivated") || false);
  const [languageSelected, setLanguageSelected] = React.useState(LocalStorage.getItemObject("languageSelected") || "en");
  
  // TODO use it and change the format
  const [subtitlesSettings, setSubtitlesSettings] = React.useState([]);

  const getSubtitlesSettings = (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      // TODO change any format
      // const result: any = await ipcRenderer.sendSync(
      //   "getSubtitlesSettings", // TODO change command maybe ? AND add to electron.js & socket.js
      //   "ping"
      // );
      // resolve(result);

      // TODO remove
      setTimeout(() => {
        resolve(false)
      }, 2000)
    });
  }

  const updateChangesToServer = (): Promise<resultFormat> => {
    return new Promise(async (resolve, reject) => {
      let params = {
        enable: subtitlesActivated,
        language: languageSelected
      }
			const result: resultFormat = await ipcRenderer.sendSync('setSubtitles', params);
			console.log('updateChangesToServer invoke', result);
			resolve(result)
		});
  }

  const handleToggleChange = (event: SelectChangeEvent) => {
    LocalStorage.setItemObject("subtitlesActivated", !subtitlesActivated)
    setSubtitlesActivated(!subtitlesActivated);

    updateChangesToServer();
  };

  const handleSelectChange = (event: any) => {
    LocalStorage.setItemObject("languageSelected", event.target.value)
    setLanguageSelected(event.target.value);

    updateChangesToServer();
  };

  useEffect(() => {
    ipcRenderer.on('subtitles-updated', (evt: any, message: any) => {
      getSubtitlesSettings().then((res) => {
        if (res.statusCode === 200) {
          toast("Subtitles settings have been updated !", {
            type: "info",
          });
          console.log("New Array", res);
          // TODO change res.data.subtitlesSettings
          setSubtitlesSettings(res.data.subtitlesSettings);
        }
      });
    });

    async function sleep(): Promise<boolean> {
      return new Promise((resolve) => {
        getSubtitlesSettings().then((res) => {
          if (res.statusCode === 200) {
            console.log("New Array", res);
            // TODO change res.data.subtitlesSettings
            setSubtitlesSettings(res.data.subtitlesSettings);
            resolve(true)
          } else {
            toast("Error listing all subtitles settings. Verify the internet connection", {
              type: "error",
            });
            resolve(false);
          }
        });
      });
    }

    sleep().then((res) => setload(!res));
  })

  /**
   * Function to add points to the loading text
   */
  function addpoint() {
    {
      setInterval(() => {
        point.length >= 3 ? setpoint(".") : setpoint(point + ".");
      }, 2000);
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
        <Box style={boxStyles}>
          <Grid container spacing={1}>
            <Grid container item style={itemStyles}>
              <h1>Enable subtitles during the stream:</h1>
              <Switch
                checked={subtitlesActivated}
                color="warning"
                onChange={handleToggleChange}
              />
            </Grid>

            {
              subtitlesActivated === true ? (
                <Grid container item style={itemStyles}>

                  <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel style={{ color: 'white' }} id="demo-simple-select-helper-label">Language</InputLabel>
                    <Select
                      style={{ color: 'white' }}
                      labelId="demo-simple-select-helper-label"
                      id="demo-simple-select-helper"
                      value={languageSelected}
                      label="Language"
                      onChange={handleSelectChange}
                    >
                      {
                        languages.map((l) => {
                          return (<MenuItem key={l.key} value={l.key}>{l.language}- {l.key}</MenuItem>)
                        })
                      }
                    </Select>
                    <FormHelperText style={{ color: 'white' }}>Select language</FormHelperText>
                  </FormControl>
                </Grid>
              ) : (<></>)
            }
          </Grid>
        </Box>
      </>
      )}
    </>
  );
}

export default Subtitles;