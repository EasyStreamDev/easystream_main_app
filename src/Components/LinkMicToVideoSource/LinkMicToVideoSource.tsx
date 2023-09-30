import React, { useEffect } from "react";
import { AllDisplaySourcesResult, AllDisplaySources, DisplaySource } from "../../Socket/interfaces";
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, List, ListItem, ListItemText, OutlinedInput, Popover, Switch, TextField, Typography, InputLabel, MenuItem } from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { toast } from "react-toastify";
import "./LinkMicToVideoSource.css"
const ipcRenderer = window.require("electron").ipcRenderer;

// LinkMicToVideoSource component
export const LinkMicToVideoSource = (props: any) => {

  const [allDisplaySources, setAllDisplaySources] = React.useState<DisplaySource[]>([]);

  // loading
  const [load, setload] = React.useState(true);
  const [point, setpoint] = React.useState(".");

  // Dialog
  const [open, setOpen] = React.useState(false);
  /**
   * Event handler for opening the dialog
   */
  const handleClickOpen = () => {
    setOpen(true);
  };

  /**
   * Event handler for canceling the dialog
   */
  const handleCancel = () => {
    setOpen(false);
  };
  const handleSave = () => {
    // if (newSubtitleParam === "") {
    //   toast("You must select a text field to add", {
    //     type: "error",
    //   });
    //   return;
    // }

    // const textField: TextFieldDetailed = JSON.parse(newSubtitleParam);
    // addSubtitleTextField(textField.uuid, newMicsListParam).then((res: resultFormat) => {
    //   if (res.statusCode === 200) {
        
    //     // Reset
    //     setNewSubtitleParam("");
    //     setNewMicsListParam([]);

    //     // Refresh
    //     refresh(textField);
    //   } else {
    //     toast("Error adding subtitle text field", {
    //       type: "error",
    //     });
    //     return;
    //   }
    // });
  }

  const getAllDisplaySources = (): Promise<AllDisplaySources> => {
    return new Promise(async (resolve, reject) => {
      const result: AllDisplaySourcesResult = await ipcRenderer.sendSync("getAllDisplaySources", "ping");
      if (result.statusCode === 200) {
        resolve(result.data);
        
      } else {
        toast.error(result.message, {
          type: "error",
        });
        reject(result.message);
      }
    });
  }

  useEffect(() => {
    const handleDisplaySourcesUpdated = (evt: any, message: any) => {
      getAllDisplaySources().then((res) => {
        setAllDisplaySources(res.display_sources);
      });
    };

    ipcRenderer.on('display-sources-updated', handleDisplaySourcesUpdated);

    async function sleep(): Promise<boolean> {
      return new Promise((resolve) => {
        getAllDisplaySources().then((res) => {
          setAllDisplaySources(res.display_sources);
          resolve(false);
        });
      });
    }

    sleep().then((res) => setload(res));

    return () => {
      ipcRenderer.removeListener('display-sources-updated', handleDisplaySourcesUpdated);
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
          <Dialog open={open} onClose={handleCancel}>
            <DialogTitle>Link Subtitle Text Field</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Text fields are used to display subtitles on the stream. You can
                link as many text fields as you want.
              </DialogContentText>

              {/* <InputLabel id="select-event-label">All text fields available</InputLabel>
              <Select
                labelId="select-event-label"
                id="select-event"
                value={newSubtitleParam}
                onChange={(action) => setNewSubtitleParam(action.target.value as string)}
                autoWidth
                label="TextField"
              >
                {availableTextFields.map((k) => {
                  return (
                    <MenuItem key={k.uuid + k.name} value={JSON.stringify(k)}>
                      {k.name}
                    </MenuItem>
                  );
                })}
              </Select>

              <InputLabel id="select-event-label">All mics available</InputLabel>
              <Select
                labelId="select-mics-label"
                id="select-mics"
                multiple
                value={newMicsListParam}
                onChange={handleChangeChipSelect}
                autoWidth
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {
                  micList.map((mic) => (
                    <MenuItem
                      key={mic}
                      value={mic}
                      style={getStyles(mic, newMicsListParam, theme)}
                    >
                      {mic}
                    </MenuItem>
                  ))
                }
              </Select> */}

            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </DialogActions>
          </Dialog>
          <div className="add_button_pos">
            <Button
              variant="contained"
              className="add_button"
              onClick={handleClickOpen}
            >
              Link subtitle text field
            </Button>
        </div>
        </>
      )
      }
    </>
  );
};
