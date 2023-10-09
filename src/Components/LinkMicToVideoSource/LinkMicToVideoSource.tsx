import React, { useEffect } from "react";
import { AllDisplaySourcesResult, AllDisplaySources, DisplaySource, AllLinksMicsToVideoSourceResult, AllLinksMicsToVideoSource, resultFormat, linkMicsToVideoSource, Mic, AllMics } from "../../Socket/interfaces";
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, List, ListItem, ListItemText, OutlinedInput, Popover, Switch, TextField, Typography, InputLabel, MenuItem, Divider } from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { toast } from "react-toastify";
import { Theme, useTheme } from '@mui/material/styles';
import { BsTrash } from "react-icons/bs";
import MicNoneIcon from '@material-ui/icons/MicNone';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import "./LinkMicToVideoSource.css"
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

// LinkMicToVideoSource component
export const LinkMicToVideoSource = (props: any) => {
  const theme = useTheme();

  const [allMics, setAllMics] = React.useState<Mic[]>([]);
  const [allDisplaySources, setAllDisplaySources] = React.useState<DisplaySource[]>([]);
  // TODO To use
  const [allLinksMicsToVideoSource, setAllLinksMicsTAllLinksMicsToVideoSource] = React.useState<linkMicsToVideoSource[]>([]);

  // loading
  const [load, setload] = React.useState(true);
  const [point, setpoint] = React.useState(".");

  // Popover
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [listMicsAvailable, setListMicsAvailable] = React.useState<string[]>([]);

  const handleClickPopover = (event: any, l: linkMicsToVideoSource) => {
    setAnchorEl(event.currentTarget);
    // TODO Fix mic.uuid ???
    setListMicsAvailable(allMics.filter((mic) => !l.mic_ids.includes(mic.uuid)).map((mic) => mic.micName))
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  // Dialog
  const [open, setOpen] = React.useState(false);
  const [newVideoSourceParam, setNewVideoSourceParam] = React.useState<DisplaySource>();
  const [newMicsListParam, setNewMicsListParam] = React.useState<string[]>([]);
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
      // On autofill we get a the stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  }
  const handleSave = () => {
    if (newVideoSourceParam === undefined || newVideoSourceParam === null) {
      toast("You must select a video source.", {
        type: "error",
      });
      return;
    }
    if (newMicsListParam.length === 0) {
      toast("You must select at least one mic.", {
        type: "error",
      });
      return;
    }

    for (let i = 0; i < newMicsListParam.length; i++) {
      const mic = newMicsListParam[i];
      linkMicToVideoSource(mic, newVideoSourceParam.uuid, true).then((res) => {
        if (i === newMicsListParam.length - 1) {
          toast("Mic(s) linked to video source.", {
            type: "success",
          });
        }
      }
      ).catch((err) => {
        toast(err, {
          type: "error",
        });
      });
    }

    // IUpdate the list of links
    getAllLinksMicsToVideoSource().then((res) => {
      setAllLinksMicsTAllLinksMicsToVideoSource(res);
    });

    // Set variables to default
    setNewVideoSourceParam(undefined);
    setNewMicsListParam([]);

    // Close the dialog
    setOpen(false);
  }

  function getStyles(name: string, personName: readonly string[], theme: Theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  const getAllMics = (): Promise<Mic[]> => {
    return new Promise(async (resolve, reject) => {
      const result: AllMics = await ipcRenderer.sendSync("getAllMics", "ping");
      if (result.statusCode === 200) {
        resolve(result.data.mics);
      } else {
        toast.error(result.message, {
          type: "error",
        });
        reject(result.message);
      }
    });
  }

  const getAllLinksMicsToVideoSource = (): Promise<linkMicsToVideoSource[]> => {
    return new Promise(async (resolve, reject) => {
      const result: AllLinksMicsToVideoSourceResult = await ipcRenderer.sendSync("getAllLinksMicsToVideoSource", "ping");
      if (result.statusCode === 200) {
        resolve(result.data.display_sources);
      } else {
        toast.error(result.message, {
          type: "error",
        });
        reject(result.message);
      }
    });
  }

  const addMicToDisplaySource = (linkMicsToVideoSource: linkMicsToVideoSource, micName: string) => {
    // TODO Check if it works
    const micId = allMics.filter((mic) => mic.micName === micName)[0].uuid;

    linkMicToVideoSource(micId, linkMicsToVideoSource.display_source_id, true).then((res) => {
      toast("Mic linked to display source.", {
        type: "success",
      });
    }
    ).catch((err) => {
      toast(err, {
        type: "error",
      });
    });
  }

  const linkMicToVideoSource = (micUuid: string, videoSourceUuid: string, enable: boolean): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      const result: resultFormat = await ipcRenderer.sendSync("linkMicToVideoSource", { "mic_ids": micUuid, "display_source_id": videoSourceUuid, "enable": enable });
      if (result.statusCode === 200) {
        resolve(true);
      } else {
        toast.error(result.message, {
          type: "error",
        });
        reject(result.message);
      }
    });
  }

  const getMicName = (micUuid: string): string => {
    for (let i = 0; i < allMics.length; i++) {
      const mic = allMics[i];
      if (mic.uuid === micUuid) {
        return mic.micName;
      }
    }
    return "Unknown";
  }

  const handleMicDelete = (displaySourceUuid: string, micUuid: string) => () => {
    linkMicToVideoSource(micUuid, displaySourceUuid, false).then((res) => {
      toast("Mic unlinked to display source.", {
        type: "success",
      });
    }
    ).catch((err) => {
      toast(err, {
        type: "error",
      });
    });
  }

  const deleteAllLinks = (linkMicsToVideoSource: linkMicsToVideoSource) => () => {
    for (let i = 0; i < linkMicsToVideoSource.mic_ids.length; i++) {
      const mic = linkMicsToVideoSource.mic_ids[i];
      linkMicToVideoSource(mic, linkMicsToVideoSource.display_source_id, false).then((res) => {
        if (i === linkMicsToVideoSource.mic_ids.length - 1) {
          toast("Mic(s) unlinked to display source.", {
            type: "success",
          });
        }
      }
      ).catch((err) => {
        toast(err, {
          type: "error",
        });
      });
    }
  }

  const getNameDisplaySourceFromUuid = (uuid: string): any => {
    console.log("DEBUG", uuid, allDisplaySources);
    for (let i = 0; i < allDisplaySources.length; i++) {
      const displaySource = allDisplaySources[i];
      if (displaySource.uuid === uuid) {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <OndemandVideoIcon style={{ marginRight: "5px" }} />
            {displaySource.name}
          </div>
        );
      }
    }
    return "Unknown";
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
    const handleMicsUpdated = (evt: any, message: any) => {
      getAllMics().then((res) => {
        setAllMics(res);
      });
    }

    ipcRenderer.on('compressor-level-updated', handleMicsUpdated);
    ipcRenderer.on('display-sources-updated', handleDisplaySourcesUpdated);

    async function sleep(): Promise<boolean> {
      return new Promise((resolve) => {
        getAllMics().then((res) => {
          setAllMics(res);

          getAllDisplaySources().then((res) => {

            setAllDisplaySources(res.display_sources);

            getAllLinksMicsToVideoSource().then((res) => {

              setAllLinksMicsTAllLinksMicsToVideoSource(res);
              
              resolve(false);
            });

          });
        });
      });
    }

    sleep().then((res) => setload(res));

    return () => {
      ipcRenderer.removeListener('display-sources-updated', handleDisplaySourcesUpdated);
      ipcRenderer.removeListener('compressor-level-updated', handleMicsUpdated);
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
          {
            allLinksMicsToVideoSource.length === 0 ? (
              <h1>No subtitles settings found</h1>
            ) : (
              <>
                <h1>Links Mics / Display source:</h1>
                <div className="allLinksMicsToVideoSourceBox">
                  <List>
                    {
                      allLinksMicsToVideoSource.map((l) => {
                        return (
                          <Box className="allLinksMicsToVideoSourceItem" key={ l.display_source_id }>
                            <ListItem
                            // Random key
                              key={ l.display_source_id }
                              secondaryAction={
                                <IconButton onClick={deleteAllLinks(l)} edge="end" color="error" aria-label="delete">
                                  <BsTrash />
                                </IconButton>
                              }
                            >
                            <ListItemText
                                primary={getNameDisplaySourceFromUuid(l.display_source_id)}
                              />
                            </ListItem>
                            <Box display="flex" justifyContent="center" m={1} p={1}>
                              {
                                l.mic_ids.map((mic_id) => (
                                  <Chip className="color-white" key={getMicName(mic_id)} label={mic_id} variant="outlined" sx={{ m: 0.5, borderColor: "#FFA500" }}
                                  icon={<MicNoneIcon className="color-orange" />} onDelete={handleMicDelete(l.display_source_id, mic_id)}
                                  />
                                ))
                              }
                              <Chip key="+" label="+" className="color-orange" sx={{ m: 0.5, fontSize: "20px", borderColor: "#FFA500" }}
                                onClick={event => handleClickPopover(event, l)}
                                />
                                {
                                  Boolean(anchorEl) &&
                                  <Popover
                                    id={l.display_source_id}
                                    open={Boolean(anchorEl)}
                                    anchorEl={anchorEl}
                                    onClose={handleClosePopover}
                                    anchorOrigin={{
                                      vertical: 'center',
                                      horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                      vertical: 'center',
                                      horizontal: 'left',
                                    }}
                                  >
                                    {
                                      listMicsAvailable.length === 0 ? (
                                        <Typography sx={{ p: 2 }}>No mic available</Typography>
                                      ) :
                                        (
                                          <div>
                                            <Typography sx={{ p: 2 }}>Select a mic:</Typography>
                                            <List>
                                              { listMicsAvailable.map((choice) => (
                                                <ListItem
                                                  key={choice}
                                                  onClick={() => addMicToDisplaySource(l, choice)}
                                                >
                                                  <ListItemText primary={choice} />
                                                </ListItem>
                                              ))}
                                            </List>
                                          </div>
                                        )
                                    }
                                  </Popover>
                                }
                            </Box>
                            {/* Show only if it's not the last element */}
                            {
                              allLinksMicsToVideoSource[allLinksMicsToVideoSource.length - 1] !== l && (
                                <Divider style={{ border: "1.5px solid orange", backgroundColor: "orange" }} />
                              )
                            }
                          </Box>
                        )
                      })
                    }
                  </List>
                </div>
              </>
            )
          }
          <Dialog open={open} onClose={handleCancel}>
            <DialogTitle>Link Mic to Display Source</DialogTitle>
            <DialogContent>
              <DialogContentText>
                When a mic is linked to a display source and the mic is used,
                the display source will be displayed on the screen. You can use this functionnality
                for podcasts, conferences, etc.
              </DialogContentText>

              <br />
              <InputLabel id="select-event-label">Select mics you want to link to a display source:</InputLabel>
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
                  allMics.map((mic) => (
                    <MenuItem
                      key={mic.micName}
                      value={mic.micName}
                      style={getStyles(mic.micName, newMicsListParam, theme)}
                    >
                      {mic.micName}
                    </MenuItem>
                  ))
                }
              </Select>

              <InputLabel id="select-event-label">Select the display source:</InputLabel>
              <Select
                labelId="select-event-label"
                id="select-event"
                value={newVideoSourceParam}
                onChange={(action) => setNewVideoSourceParam(JSON.parse(action.target.value as string) as DisplaySource)}
                autoWidth
                label="TextField"
              >
                {
                  allDisplaySources.filter((displaySource) => {
                    let found = false;
                    for (let i = 0; i < allLinksMicsToVideoSource.length; i++) {
                      const link = allLinksMicsToVideoSource[i];
                      if (link.display_source_id === displaySource.uuid) {
                        found = true;
                        break;
                      }
                    }
                    return !found;
                  }).map((k) => {
                    return (
                      <MenuItem key={k.uuid + k.name} value={JSON.stringify(k)}>
                        {k.name}
                      </MenuItem>
                    );
                  })
                }
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
              Link subtitle text field
            </Button>
        </div>
        </>
      )
      }
    </>
  );
};
