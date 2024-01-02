import MicNoneIcon from "@material-ui/icons/MicNone";
import OndemandVideoIcon from "@material-ui/icons/OndemandVideo";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Popover,
  Typography,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import React, { useEffect } from "react";
import { BsTrash } from "react-icons/bs";
import { toast } from "react-toastify";
import {
  AllDisplaySources,
  AllDisplaySourcesResult,
  AllLinksMicsToVideoSourceResult,
  AllMics,
  DisplaySource,
  Mic,
  linkMicsToVideoSource,
  resultFormat,
} from "../../Socket/interfaces";
import "./LinkMicToVideoSource.css";
import { get } from "http";
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
  const [allMics, setAllMics] = React.useState<Mic[]>([]);
  const [allDisplaySources, setAllDisplaySources] = React.useState<DisplaySource[]>([]);
  // TODO To use
  const [allLinksMicsToVideoSource, setAllLinksMicsToVideoSource] = React.useState<linkMicsToVideoSource[]>([]);

  // loading
  const [load, setload] = React.useState(true);
  const [point, setpoint] = React.useState(".");

  // Popover
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [listMicsAvailable, setListMicsAvailable] = React.useState<string[]>([]);

  // Dialog
  const [open, setOpen] = React.useState(false);
  const [newVideoSourceListParam, setNewVideoSourceListParam] = React.useState<string[]>([]);
  const [newMicParam, setNewMicParam] = React.useState<string>("");
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

  const handleChangeChipSelect = (event: SelectChangeEvent<typeof newVideoSourceListParam>) => {
    const {
      target: { value },
    } = event;
    setNewVideoSourceListParam(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleSave = () => {
    if (
      newVideoSourceListParam === undefined ||
      newVideoSourceListParam === null ||
      newVideoSourceListParam.length === 0
    ) {
      toast("You must select a video source.", {
        type: "error",
      });
      return;
    }
    if (newMicParam === undefined || newMicParam === null || newMicParam.length === 0 || newMicParam === "") {
      toast("You must select at least one mic.", {
        type: "error",
      });
      return;
    }

    const videoSourceListParamsUuids = newVideoSourceListParam.map((videoSourceName) => {
      for (let i = 0; i < allDisplaySources.length; i++) {
        const displaySource = allDisplaySources[i];
        if (displaySource.name === videoSourceName) {
          return displaySource.uuid;
        }
      }
      return "";
    });

    console.log("newVideoSourceListParam", newVideoSourceListParam);
    console.log("LINK", newMicParam, videoSourceListParamsUuids);

    linkMicToVideoSource(newMicParam, videoSourceListParamsUuids)
      .then((res) => {
        toast("Mic(s) linked to video source.", {
          type: "success",
        });
      })
      .catch((err) => {
        toast("ERROR", {
          type: "error",
        });
      });

    // IUpdate the list of links
    getAllLinksMicsToVideoSource().then((res) => {
      setAllLinksMicsToVideoSource(res);
    });

    // Set variables to default
    setNewVideoSourceListParam([]);
    setNewMicParam("");

    // Close the dialog
    setOpen(false);
  };

  const getAllMics = (): Promise<Mic[]> => {
    return new Promise(async (resolve, reject) => {
      const result: AllMics = await ipcRenderer.sendSync("/microphones/get", "ping");
      if (result.statusCode === 200) {
        resolve(result.data.mics);
      } else {
        toast.error(result.message, {
          type: "error",
        });
        reject(result.message);
      }
    });
  };

  const getAllLinksMicsToVideoSource = (): Promise<linkMicsToVideoSource[]> => {
    return new Promise(async (resolve, reject) => {
      const result: AllLinksMicsToVideoSourceResult = await ipcRenderer.sendSync("/mtdsis/get", "ping");
      if (result.statusCode === 200) {
        resolve(result.data.links);
      } else {
        toast.error(result.message, {
          type: "error",
        });
        reject(result.message);
      }
    });
  };

  const removeMicToVideoSource = (micUuid: string): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      const result: resultFormat = await ipcRenderer.sendSync("/mtdsis/remove", {
        mic_id: micUuid,
      });
      if (result.statusCode === 200) {
        resolve(true);
      } else {
        toast.error(result.message, {
          type: "error",
        });
        reject(result.message);
      }
    });
  };

  const linkMicToVideoSource = (micUuid: string, videoSourceUuids: string[]): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      const result: resultFormat = await ipcRenderer.sendSync("/mtdsis/create", {
        mic_id: micUuid,
        display_sources_ids: videoSourceUuids,
      });
      if (result.statusCode === 200) {
        resolve(true);
      } else {
        toast.error(result.message, {
          type: "error",
        });
        reject(result.message);
      }
    });
  };

  const getMicName = (micUuid: string): string => {
    for (let i = 0; i < allMics.length; i++) {
      const mic = allMics[i];
      if (mic.uuid === micUuid) {
        return mic.micName;
      }
    }
    return "Unknown";
  };

  const handleMicDelete = (micUuid: string) => () => {
    removeMicToVideoSource(micUuid)
      .then((res) => {
        getAllLinksMicsToVideoSource().then((res) => {
          setAllLinksMicsToVideoSource(res);
          toast("Mic unlinked to display source.", {
            type: "success",
          });
        });
      })
      .catch((err) => {
        toast(err, {
          type: "error",
        });
      });
  };

  const getNameDisplaySourceFromUuid = (uuid: string): any => {
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
  };

  const getAllDisplaySources = (): Promise<AllDisplaySources> => {
    return new Promise(async (resolve, reject) => {
      const result: AllDisplaySourcesResult = await ipcRenderer.sendSync("/display-sources/get", "ping");
      if (result.statusCode === 200) {
        resolve(result.data);
      } else {
        toast.error(result.message, {
          type: "error",
        });
        reject(result.message);
      }
    });
  };

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
    };

    ipcRenderer.on("compressor-level-updated", handleMicsUpdated);
    ipcRenderer.on("display-sources-updated", handleDisplaySourcesUpdated);

    async function sleep(): Promise<boolean> {
      return new Promise((resolve) => {
        getAllMics().then((res) => {
          setAllMics(res);

          getAllDisplaySources().then((res) => {
            setAllDisplaySources(res.display_sources);

            getAllLinksMicsToVideoSource().then((res) => {
              setAllLinksMicsToVideoSource(res);

              resolve(false);
            });
          });
        });
      });
    }

    sleep().then((res) => setload(res));

    return () => {
      ipcRenderer.removeListener("display-sources-updated", handleDisplaySourcesUpdated);
      ipcRenderer.removeListener("compressor-level-updated", handleMicsUpdated);
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
          {allLinksMicsToVideoSource.length === 0 ? (
            <h1>No subtitles settings found</h1>
          ) : (
            <>
              <h1>Links mics to display source(s):</h1>
              <div className="allLinksMicsToVideoSourceBox non-dragable">
                <List>
                  {allLinksMicsToVideoSource.map((l) => {
                    return (
                      <Box className="allLinksMicsToVideoSourceItem non-dragable" key={l.mic_id}>
                        <ListItem
                          // Random key
                          key={l.mic_id}
                          secondaryAction={
                            <IconButton
                              onClick={handleMicDelete(l.mic_id)}
                              edge="end"
                              color="error"
                              aria-label="delete"
                            >
                              <BsTrash color="white" />
                            </IconButton>
                          }
                        >
                          <ListItemText primary={getMicName(l.mic_id)} />
                        </ListItem>
                        <Box display="flex" justifyContent="center" m={1} p={1}>
                          {l.display_source_ids.map((display_source_id) => (
                            <Chip
                              className="color-white"
                              key={display_source_id}
                              label={getNameDisplaySourceFromUuid(display_source_id)}
                              variant="outlined"
                              sx={{ m: 0.5, borderColor: "#FFA500" }}
                            />
                          ))}
                        </Box>
                      </Box>
                    );
                  })}
                </List>
              </div>
            </>
          )}
          <Dialog className="non-dragable" open={open} onClose={handleCancel}>
            <DialogTitle>Link Mic to Display Source</DialogTitle>
            <DialogContent>
              <DialogContentText>
                When a mic is linked to a display source and the mic is used, the display source will be displayed on
                the screen. You can use this functionnality for podcasts, conferences, etc.
              </DialogContentText>

              <br />

              <InputLabel id="select-event-label">Select the mic source:</InputLabel>
              <Select
                labelId="select-event-label"
                id="select-event"
                value={newMicParam}
                onChange={(action) => setNewMicParam(action.target.value as string)}
                autoWidth
                label="TextField"
              >
                {allMics.map((mic) => {
                  return (
                    <MenuItem key={mic.uuid} value={mic.uuid} style={{ fontWeight: 300 }}>
                      {mic.micName}
                    </MenuItem>
                  );
                })}
              </Select>

              <InputLabel id="select-event-label">Select display source(s):</InputLabel>
              <Select
                labelId="select-mics-label"
                id="select-mics"
                multiple
                onChange={handleChangeChipSelect}
                value={newVideoSourceListParam}
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
                {allDisplaySources.map((displaySource) => (
                  <MenuItem key={displaySource.uuid} value={displaySource.name} style={{ fontWeight: 300 }}>
                    {displaySource.name}
                  </MenuItem>
                ))}
              </Select>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </DialogActions>
          </Dialog>
          <div className="add-button-pos">
            <Button variant="contained" className="add-button" onClick={handleClickOpen}>
              +
            </Button>
          </div>
        </>
      )}
    </>
  );
};
