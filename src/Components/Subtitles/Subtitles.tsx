import { Switch } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import CSS from 'csstype';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { languages } from "../Language/LanguageData";
import Grid from '@mui/material/Grid';
import { LocalStorage } from "../../LocalStorage/LocalStorage";

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

  const [subtitlesActivated, setSubtitlesActivated] = React.useState(LocalStorage.getItemObject("subtitlesActivated") || false);
  const [languageSelected, setLanguageSelected] = React.useState(LocalStorage.getItemObject("languageSelected") || "en");

  const handleToggleChange = (event: SelectChangeEvent) => {
    LocalStorage.setItemObject("subtitlesActivated", !subtitlesActivated)
    setSubtitlesActivated(!subtitlesActivated);
  };

  const handleSelectChange = (event: any) => {
    LocalStorage.setItemObject("languageSelected", event.target.value)
    setLanguageSelected(event.target.value);
  };

  return (
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
  );
}

export default Subtitles;