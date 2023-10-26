import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  OutlinedInput,
  Popover,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import React, { Fragment, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
  AllSubtitlesSettings,
  AllTextFields,
  TextFieldSimple,
  TextFieldDetailed,
  resultFormat,
  AllMics,
} from "../../Socket/interfaces";
import { toast } from "react-toastify";
import { BsTrash } from "react-icons/bs";
import "./Subtitles.css";
import { Theme, useTheme } from "@mui/material/styles";
import MicNoneIcon from "@material-ui/icons/MicNone";
const ipcRenderer = window.require("electron").ipcRenderer;

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const Subtitles = () => {
  const theme = useTheme();

  // Dialog
  const [open, setOpen] = React.useState(false);
  const [newSubtitleParam, setNewSubtitleParam] = React.useState("");
  const [newMicsListParam, setNewMicsListParam] = React.useState<string[]>([]);

  // Loading
  const [load, setload] = React.useState(true);
  const [point, setpoint] = React.useState(".");

  // Popover
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [listMicsAvailable, setListMicsAvailable] = React.useState<string[]>([]);

  const handleClickPopover = (event: any, l: TextFieldSimple) => {
    setAnchorEl(event.currentTarget);
    setListMicsAvailable(micList.filter((mic) => !l.linked_mics.includes(mic)));
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const [subtitlesSettings, setSubtitlesSettings] = React.useState<TextFieldSimple[]>([]);
  const [availableTextFields, setAvailableTextFields] = React.useState<TextFieldDetailed[]>([]);
  const [micList, setMicList] = React.useState<string[]>([]);

  function getStyles(name: string, personName: readonly string[], theme: Theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
    };
  }

  const getAllCompressors = (): Promise<AllMics> => {
    return new Promise(async (resolve, reject) => {
      const result: AllMics = await ipcRenderer.sendSync("getAllMics", "ping");
      resolve(result);
    });
  };

  const updateMicList = (notify = false) => {
    getAllCompressors().then((result) => {
      if (result.statusCode === 200) {
        // Only get the mics names
        const mics = result.data.mics.map((mic) => mic.micName);
        setMicList(mics);
        if (notify) {
          toast("Mics list updated", {
            type: "info",
          });
        }
      } else {
        toast("Error while getting the mics list", {
          type: "error",
        });
      }
    });
  };

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

  const handleChangeChipSelect = (event: SelectChangeEvent<typeof newMicsListParam>) => {
    const {
      target: { value },
    } = event;
    setNewMicsListParam(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleMicDelete = (uuid_text_field: string, micToDelete: string) => () => {
    let good_subtitle_setting = subtitlesSettings.filter(
      (subtitle_setting) => subtitle_setting.uuid === uuid_text_field
    )[0];
    let new_mics = good_subtitle_setting.linked_mics.filter((mic) => mic !== micToDelete);
    console.log("new_mics", new_mics);
    addSubtitleTextField(uuid_text_field, new_mics).then((res: resultFormat) => {
      if (res.statusCode === 200) {
        // Refresh
        getSubtitlesSettings().then((subtitles_res) => {
          setSubtitlesSettings(subtitles_res.data.text_fields);
        });

        toast("Mic deleted from the text field", {
          type: "success",
        });
      } else {
        toast("Error while deleting the mic from the text field", {
          type: "error",
        });
      }
    });
  };

  const addSubtitleTextField = (uuid: string, linkedMics: string[]): Promise<resultFormat> => {
    return new Promise(async (resolve, reject) => {
      const param = {
        linked_mics: linkedMics,
        uuid: uuid,
      };
      const result: resultFormat = ipcRenderer.sendSync("setSubtitles", param);
      resolve(result);
    });
  };

  const removeSubtitleTextField = (uuid: string): Promise<resultFormat> => {
    return new Promise(async (resolve, reject) => {
      const param = {
        linked_mics: [], // Empty linked_mics means that the text field will be deleted
        uuid: uuid,
      };
      const result: resultFormat = ipcRenderer.sendSync("setSubtitles", param);
      resolve(result);
    });
  };

  const getSubtitlesSettings = (): Promise<AllSubtitlesSettings> => {
    return new Promise(async (resolve, reject) => {
      const result: AllSubtitlesSettings = await ipcRenderer.sendSync("getSubtitlesSettings", "ping");
      resolve(result);
    });
  };

  const getAllTextFields = (): Promise<AllTextFields> => {
    return new Promise(async (resolve, reject) => {
      const result: any = await ipcRenderer.sendSync("getAllTextFields", "ping");
      resolve(result);
    });
  };

  const refresh = (textField?: TextFieldDetailed) => {
    getSubtitlesSettings().then((subtitles_res) => {
      if (subtitles_res.statusCode === 200) {
        console.log("getSubtitlesSettings", subtitles_res);
        setSubtitlesSettings(subtitles_res.data.text_fields);

        if (textField !== undefined) {
          // Remove the text field from availableTextFields
          const availableTextFieldsCopy: TextFieldDetailed[] = availableTextFields.slice();
          const index = availableTextFieldsCopy.findIndex((tf: TextFieldDetailed) => {
            return tf.uuid === textField.uuid;
          });

          if (index !== -1) {
            availableTextFieldsCopy.splice(index, 1);

            setAvailableTextFields(availableTextFieldsCopy);

            if (availableTextFields.length > 0) {
              setNewSubtitleParam(JSON.stringify(availableTextFields[0]));
            }
          }
        }

        // toast("SubtitlsetAvailableTextFieldse text field added !", {
        //   type: "success",
        // });

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
  };

  const handleSave = () => {
    if (newSubtitleParam === "") {
      toast("You must select a text field to add", {
        type: "error",
      });
      return;
    }

    const textField: TextFieldDetailed = JSON.parse(newSubtitleParam);
    addSubtitleTextField(textField.uuid, newMicsListParam).then((res: resultFormat) => {
      if (res.statusCode === 200) {
        // Reset
        setNewSubtitleParam("");
        setNewMicsListParam([]);

        // Refresh
        refresh(textField);
      } else {
        toast("Error adding subtitle text field", {
          type: "error",
        });
        return;
      }
    });
  };

  const addMicToSubtitle = (text_field: TextFieldSimple, mic_to_add: any) => {
    let new_mics = text_field.linked_mics.slice();
    new_mics.push(mic_to_add);

    addSubtitleTextField(text_field.uuid, new_mics).then((res: resultFormat) => {
      if (res.statusCode === 200) {
        // Refresh
        refresh();
        toast("Mic added to the text field", {
          type: "success",
        });
      } else {
        toast("Error while adding the mic to the text field", {
          type: "error",
        });
      }
    });
    refresh();
    handleClosePopover();
  };

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
          getSubtitlesSettings().then((subtitles_res) => {
            if (subtitles_res.statusCode === 200) {
              console.log("getSubtitlesSettings", subtitles_res);
              setSubtitlesSettings(subtitles_res.data.text_fields);

              getAllTextFields().then((txt_field_res) => {
                if (txt_field_res.statusCode === 200) {
                  console.log("getAllTextFields", txt_field_res);

                  // Filter txt_field_res.data.text_fields to only keep the ones that are not in subtitlesSettings
                  const availableTextFields: TextFieldDetailed[] = txt_field_res.data.text_fields.filter(
                    (textField: TextFieldDetailed) => {
                      return !subtitles_res.data.text_fields?.some((subtitlesSetting: TextFieldSimple) => {
                        return subtitlesSetting.uuid === textField.uuid;
                      });
                    }
                  );

                  setAvailableTextFields(availableTextFields);

                  if (availableTextFields.length > 0) {
                    setNewSubtitleParam(JSON.stringify(availableTextFields[0]));
                  }

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
    };
  };

  useEffect(() => {
    const handleSubtitlesUpdated = (evt: any, message: any) => {
      getSubtitlesSettings().then((subtitles_res) => {
        if (subtitles_res.statusCode === 200) {
          console.log("getSubtitlesSettings", subtitles_res);
          setSubtitlesSettings(subtitles_res.data.text_fields);

          getAllTextFields().then((txt_field_res) => {
            if (txt_field_res.statusCode === 200) {
              toast("Subtitles settings have been updated !", {
                type: "info",
              });
              console.log("New Array", txt_field_res);

              // Filter txt_field_res.data.text_fields to only keep the ones that are not in subtitlesSettings
              const availableTextFields: TextFieldDetailed[] = txt_field_res.data.text_fields.filter(
                (textField: TextFieldDetailed) => {
                  return !subtitles_res.data.text_fields?.some((subtitlesSetting: TextFieldSimple) => {
                    return subtitlesSetting.uuid === textField.uuid;
                  });
                }
              );

              setAvailableTextFields(availableTextFields);

              if (availableTextFields.length > 0) {
                setNewSubtitleParam(JSON.stringify(availableTextFields[0]));
              }
            }
          });
        }
      });
    };
    const handleMicUpdated = (evt: any, message: any) => {
      updateMicList(true);
    };

    ipcRenderer.on("compressor-level-updated", handleMicUpdated);
    ipcRenderer.on("subtitles-updated", handleSubtitlesUpdated);

    async function sleep(): Promise<boolean> {
      return new Promise((resolve) => {
        updateMicList(); // Get the mic list
        getSubtitlesSettings().then((subtitles_res) => {
          if (subtitles_res.statusCode === 200) {
            console.log("getSubtitlesSettings", subtitles_res);
            setSubtitlesSettings(subtitles_res.data.text_fields);

            getAllTextFields().then((txt_field_res) => {
              if (txt_field_res.statusCode === 200) {
                console.log("getAllTextFields", txt_field_res);

                // Filter txt_field_res.data.text_fields to only keep the ones that are not in subtitlesSettings
                const availableTextFields: TextFieldDetailed[] = txt_field_res.data.text_fields.filter(
                  (textField: TextFieldDetailed) => {
                    return !subtitles_res.data.text_fields?.some((subtitlesSetting: TextFieldSimple) => {
                      return subtitlesSetting.uuid === textField.uuid;
                    });
                  }
                );

                setAvailableTextFields(availableTextFields);

                if (availableTextFields.length > 0) {
                  setNewSubtitleParam(JSON.stringify(availableTextFields[0]));
                }

                resolve(true);
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
      ipcRenderer.removeListener("compressor-level-updated", handleMicUpdated);
      ipcRenderer.removeListener("subtitles-updated", handleSubtitlesUpdated);
    };
  }, []);

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
          {subtitlesSettings.length === 0 ? (
            <h1>No subtitles settings found</h1>
          ) : (
            <>
              <h1>Subtitles text fields activated:</h1>
              <div className="subtitlesSettingsBox non-dragable">
                <List>
                  {subtitlesSettings.map((l) => {
                    return (
                      <Box className="subtitlesSettingsItem" key={l.uuid}>
                        <ListItem
                          key={l.uuid}
                          secondaryAction={
                            <IconButton
                              onClick={deleteSubtitleTextField(l.uuid)}
                              edge="end"
                              color="error"
                              aria-label="delete"
                            >
                              <BsTrash color="white" />
                            </IconButton>
                          }
                        >
                          <ListItemText primary={"Text Field: " + l.name} />
                        </ListItem>
                        <Box display="flex" justifyContent="center" m={1} p={1}>
                          {l.linked_mics.map((value) => (
                            <Chip
                              className="color-white"
                              key={value}
                              label={value}
                              variant="outlined"
                              sx={{ m: 0.5, borderColor: "#FFA500" }}
                              icon={<MicNoneIcon className="color-orange" />}
                              onDelete={handleMicDelete(l.uuid, value)}
                            />
                          ))}
                          <Chip
                            key="+"
                            label="+"
                            className="color-orange non-dragable"
                            sx={{ m: 0.5, fontSize: "20px", borderColor: "#FFA500" }}
                            onClick={(event) => handleClickPopover(event, l)}
                          />
                          {Boolean(anchorEl) && (
                            <Popover
                              id={l.uuid}
                              open={Boolean(anchorEl)}
                              anchorEl={anchorEl}
                              onClose={handleClosePopover}
                              anchorOrigin={{
                                vertical: "center",
                                horizontal: "right",
                              }}
                              transformOrigin={{
                                vertical: "center",
                                horizontal: "left",
                              }}
                            >
                              {listMicsAvailable.length === 0 ? (
                                <Typography sx={{ p: 2 }}>No mic available</Typography>
                              ) : (
                                <div>
                                  <Typography sx={{ p: 2 }}>Select a mic:</Typography>
                                  <List>
                                    {listMicsAvailable.map((choice) => (
                                      <ListItem key={choice} onClick={() => addMicToSubtitle(l, choice)}>
                                        <ListItemText primary={choice} />
                                      </ListItem>
                                    ))}
                                  </List>
                                </div>
                              )}
                            </Popover>
                          )}
                        </Box>
                        {/* Show only if it's not the last element */}
                        {subtitlesSettings[subtitlesSettings.length - 1] !== l && (
                          <Divider style={{ border: "1.5px solid orange", backgroundColor: "orange" }} />
                        )}
                      </Box>
                    );
                  })}
                </List>
              </div>
            </>
          )}

          <Dialog className="non-dragable" open={open} onClose={handleCancel}>
            <DialogTitle>Link Subtitle Text Field</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Text fields are used to display subtitles on the stream. You can link as many text fields as you want.
              </DialogContentText>

              <InputLabel id="select-event-label">All text fields available</InputLabel>
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
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {micList.map((mic) => (
                  <MenuItem key={mic} value={mic} style={getStyles(mic, newMicsListParam, theme)}>
                    {mic}
                  </MenuItem>
                ))}
              </Select>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </DialogActions>
          </Dialog>

          <div className="add_button_pos">
            <Button variant="contained" className="add_button" onClick={handleClickOpen}>
              Link subtitle text field
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default Subtitles;
