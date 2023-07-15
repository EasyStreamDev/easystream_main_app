import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, List, ListItem, ListItemText } from "@mui/material";
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
import { AllSubtitlesSettings, AllTextFields, TextFieldSimple, TextFieldDetailed, resultFormat } from "../../Socket/interfaces";
import { toast } from "react-toastify";
import { BsTrash } from "react-icons/bs";
import "./Subtitles.css";
const ipcRenderer = window.require('electron').ipcRenderer

export const Subtitles = () => {

  // Dialog
  const [open, setOpen] = React.useState(false);
  const [newSubtitleParam, setNewSubtitleParam] = React.useState("");

  // Loading
  const [load, setload] = React.useState(true);
  const [point, setpoint] = React.useState(".");



  // TODO use subtitlesSettings to display
  const [subtitlesSettings, setSubtitlesSettings] = React.useState<TextFieldSimple[]>([]);

  // TODO use availableTextFields to display
  const [availableTextFields, setAvailableTextFields] = React.useState<TextFieldDetailed[]>([]);

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

  
  const addSubtitleTextField = (uuid: string): Promise<resultFormat> => {
    return new Promise(async (resolve, reject) => {
      const param = {
        enable: true,
        uuid: uuid,
      }
      const result: resultFormat = ipcRenderer.sendSync('setSubtitles', param);
      resolve(result);
    });
  }

  const removeSubtitleTextField = (uuid: string): Promise<resultFormat> => {
    return new Promise(async (resolve, reject) => {
      const param = {
        enable: false,
        uuid: uuid,
      }
      const result: resultFormat = ipcRenderer.sendSync('setSubtitles', param);
      resolve(result);
    });
  }
  
  const getSubtitlesSettings = (): Promise<AllSubtitlesSettings> => {
    return new Promise(async (resolve, reject) => {
      const result: any = await ipcRenderer.sendSync(
        "getSubtitlesSettings",
        "ping"
      );
      resolve(result);
    });
  }
  
  const getAllTextFields = (): Promise<AllTextFields> => {
    return new Promise(async (resolve, reject) => {
      const result: any = await ipcRenderer.sendSync(
        "getAllTextFields",
        "ping"
        );
      resolve(result);
    });
  }
  
  const handleSave = () => {
    if (newSubtitleParam === "") {
      toast("You must select a text field to add", {
        type: "error",
      });
      return;
    }

    const textField: TextFieldDetailed = JSON.parse(newSubtitleParam);
    addSubtitleTextField(textField.uuid).then((res: resultFormat) => {
      if (res.statusCode === 200) {
        
        // Reset
        setNewSubtitleParam("");

        // Refresh
        getSubtitlesSettings().then((res) => {
          if (res.statusCode === 200) {
            console.log("getSubtitlesSettings", res);
            setSubtitlesSettings(res.data.text_fields);
            
            // Remove the text field from availableTextFields
            const availableTextFieldsCopy: TextFieldDetailed[] = availableTextFields.slice();
            const index = availableTextFieldsCopy.findIndex((tf: TextFieldDetailed) => {
              return tf.uuid === textField.uuid;
            });

            if (index !== -1) {
              availableTextFieldsCopy.splice(index, 1);
              setAvailableTextFields(availableTextFieldsCopy);
            }

            toast("Subtitle text field added !", {
              type: "success",
            });

            // Close the dialog
            setOpen(false);

            return;

          } else {
            toast("Error listing all subtitles settings. Verify the internet connection", {
              type: "error",
            });
            return;
          }
        });
      } else {
        toast("Error adding subtitle text field", {
          type: "error",
        });
        return;
      }
    });
  }

  const deleteSubtitleTextField = (uuid: string) => {
    return () => {
      removeSubtitleTextField(uuid).then((res: resultFormat) => {
        if (res.statusCode === 200) {

          // remove locally
          const subtitlesSettingsCopy: TextFieldSimple[] = subtitlesSettings.slice();
          const index = subtitlesSettingsCopy.findIndex((tf: TextFieldSimple) => {
            return tf.uuid === uuid;
          });
          
          if (index !== -1) {
            subtitlesSettingsCopy.splice(index, 1);
            setSubtitlesSettings(subtitlesSettingsCopy);
          }

          toast("Subtitle text field deleted !", {
            type: "success",
          });

          // Refresh
          getSubtitlesSettings().then((res) => {
            if (res.statusCode === 200) {
              console.log("getSubtitlesSettings", res);
              setSubtitlesSettings(res.data.text_fields);

              getAllTextFields().then((res) => {
                if (res.statusCode === 200) {
                  console.log("getAllTextFields", res);
                  setAvailableTextFields(res.data.text_fields);
                  return;
                }
              });


            } else {
              toast("Error listing all subtitles settings. Verify the internet connection", {
                type: "error",
              });
              return;
            }
          });
        } else {
          toast("Error deleting subtitle text field", {
            type: "error",
          });
          return;
        }
      });
    }
  }

  useEffect(() => {
    const handleSubtitlesUpdated = (evt: any, message: any) => {
      getSubtitlesSettings().then((res) => {
        if (res.statusCode === 200) {
          console.log("getSubtitlesSettings", res);
          setSubtitlesSettings(res.data.text_fields);
          
          getAllTextFields().then((res) => {
            if (res.statusCode === 200) {
              toast("Subtitles settings have been updated !", {
                type: "info",
              });
              console.log("New Array", res);
              
              // Filter res.data.text_fields to only keep the ones that are not in subtitlesSettings
              const availableTextFields: TextFieldDetailed[] = res.data.text_fields.filter((textField: TextFieldDetailed) => {
                return !subtitlesSettings.some((subtitlesSetting: TextFieldSimple) => {
                  return subtitlesSetting.uuid === textField.uuid;
                });
              });
              setAvailableTextFields(availableTextFields);
            }
          });
        }
      });
    };
  
    ipcRenderer.on('subtitles-updated', handleSubtitlesUpdated);

    async function sleep(): Promise<boolean> {
      return new Promise((resolve) => {
        getSubtitlesSettings().then((res) => {
          if (res.statusCode === 200) {
            console.log("getSubtitlesSettings", res);
            setSubtitlesSettings(res.data.text_fields);

            getAllTextFields().then((res) => {
              if (res.statusCode === 200) {
                console.log("getAllTextFields", res);
                setAvailableTextFields(res.data.text_fields);

                resolve(true)

              } else {
                toast("Error listing all text fields. Verify the internet connection", {
                  type: "error",
                });
                resolve(false);
              }
            });
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

    return () => {
      ipcRenderer.removeListener('subtitles-updated', handleSubtitlesUpdated);
    };
  }, [])

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
          {
            subtitlesSettings.length === 0 ? (
              <h1>No subtitles settings found</h1>
            ) : (
              <>
                <h1>Subtitles text fields activated:</h1>
                <div className="subtitlesSettingsBox">
                  <List>
                    {
                      subtitlesSettings.map((l) => {
                        return (
                          <ListItem
                          className="subtitlesSettingsItem"
                          key={l.uuid}
                          secondaryAction={
                            <IconButton onClick={deleteSubtitleTextField(l.uuid)} edge="end" color="warning" aria-label="delete">
                              <BsTrash />
                            </IconButton>
                          }
                        >
                          <ListItemText
                            primary={l.name}
                            secondary={"uuid: " + l.uuid}
                          />
                        </ListItem>
                        )
                      })
                    }
                  </List>
                </div>
              </>
            )
          }

      <Dialog open={open} onClose={handleCancel}>
        <DialogTitle>Add Subtitle Text Field</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Text fields are used to display subtitles on the stream. You can
            add as many text fields as you want.
          </DialogContentText>

          <InputLabel id="select-event-label">All text fields available</InputLabel>
          <Select
            labelId="select-event-label"
            id="select-event"
            value={newSubtitleParam}
            onChange={(action) => setNewSubtitleParam(action.target.value as string)}
            autoWidth
            label="ParameterReaction"
          >
            {availableTextFields.map((k) => {
              return (
                <MenuItem key={k.uuid} value={JSON.stringify(k)}>
                  {k.name}
                </MenuItem>
              );
            })}
          </Select>

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
            Add subtitle text field
          </Button>
        </div>
      </>
      )}
    </>
  );
}

export default Subtitles;