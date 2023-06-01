import React from 'react';
import './CreateReactions.css';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { AiFillVideoCamera, AiOutlineBug, AiOutlinePlayCircle, AiOutlineSound, AiOutlineStop, AiOutlineVideoCamera } from 'react-icons/ai';
import { MdPanoramaHorizontal } from 'react-icons/md';
import { IconButton, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { BsTrash } from 'react-icons/bs';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { LocalStorage } from '../../../LocalStorage/LocalStorage';
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export enum ReactionType {
  SCENE_SWITCH = "SCENE_SWITCH",
  TOGGLE_AUDIO_COMPRESSOR = "TOGGLE_AUDIO_COMPRESSOR",
  START_STREAM = "START_STREAM",
  STOP_STREAM = "STOP_STREAM",
  START_REC = "START_REC",
  STOP_REC = "STOP_REC",
}

export const CreateReactions = () => {

    const keysReactionType = Object.keys(ReactionType);

    const [open, setOpen] = React.useState(false);
    const [newActionName, setNewActionName] = React.useState("");
    const [newActionSelected, setNewActionSelected] = React.useState("SCENE_SWITCH");
    const [newActionParam, setNewActionParam] = React.useState("")

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
    }

    const handleOnChangeSelect = (action: SelectChangeEvent<unknown>) => {
      const value = action.target.value as ReactionType;
      setNewActionSelected(value);
    };

    const handleClickOpen = () => {
      setOpen(true);
    };

    const [ actionsList, setActionsList ] = React.useState(LocalStorage.getItemObject("actionsList") || [])

    const handleSave = () => {
      console.log("newActionName", newActionName);
      console.log("newActionSelected", newActionSelected);
      console.log("newActionParam", newActionParam);
      if (newActionName !== "") {

        if (!(newActionSelected in ReactionType)) {
          toast("Missing reaction type.", {
            type: "error"
          });
          return
        }

        let newElem: any = {
          id: actionsList.length > 0 ? Math.max(...actionsList.map((o: any) => o.id)) + 1 : 1,
          name: newActionName,
          action: newActionSelected as ReactionType,
        }

        if (newActionParam) {
          if (newActionSelected === ReactionType.TOGGLE_AUDIO_COMPRESSOR)
            newElem.params = {
              "audio-source": newActionParam,
              "toggle": true
            };
          if (newActionSelected === ReactionType.SCENE_SWITCH)
            newElem.params = { "scene": newActionParam };
          if (newActionSelected === ReactionType.START_STREAM)
            newElem.params = { "delay": newActionParam };
          if (newActionSelected === ReactionType.STOP_STREAM)
            newElem.params = { "delay": newActionParam };
          if (newActionSelected === ReactionType.START_REC)
            newElem.params = { "delay": newActionParam };
          if (newActionSelected === ReactionType.STOP_REC)
            newElem.params = { "delay": newActionParam };
        }

        if (!newActionParam && newActionSelected === ReactionType.SCENE_SWITCH) {
          toast("Missing scene name as parameter.", {
            type: "error"
          });
          return
        }

        if (!newActionParam && newActionSelected === ReactionType.TOGGLE_AUDIO_COMPRESSOR) {
          toast("Missing audio source identifier name as parameter.", {
            type: "error"
          });
          return
        }

        if (!newActionParam && ((newActionSelected === ReactionType.START_STREAM) || (newActionSelected === ReactionType.STOP_STREAM) || (newActionSelected === ReactionType.START_REC) || (newActionSelected === ReactionType.STOP_REC))) {
          toast("Missing delay (in seconds) as parameter.", {
            type: "error"
          });
          return
        }

        const newList = actionsList.concat([newElem]);

        setActionsList(newList);
        LocalStorage.setItemObject("actionsList", newList)
        toast("Reaction saved !", {
          type: "success"
        });

        setNewActionName("");
        setNewActionSelected("SCENE_SWITCH");
        setNewActionParam("");
        setOpen(false);

      } else {
        toast("Missing name of the reaction.", {
          type: "error"
        });
      }
    };

    const handleCancel = () => {
      setOpen(false);
    }


    function deleteAction(id: number) {
      const newList = actionsList.filter((item: any) => item.id !== id);

      LocalStorage.setItemObject("actionsList", newList)
      setActionsList(newList);
    }

    function getAction(actionEnum: any) {
      if (actionEnum === ReactionType.TOGGLE_AUDIO_COMPRESSOR)
        return "Toggle the audio compressor";
      if (actionEnum === ReactionType.SCENE_SWITCH)
        return "Change the scene"
      if (actionEnum === ReactionType.START_STREAM)
        return "Start the stream"
      if (actionEnum === ReactionType.STOP_STREAM)
        return "Stop the stream"
      if (actionEnum === ReactionType.START_REC)
        return "Start the record"
      if (actionEnum === ReactionType.STOP_REC)
        return "Stop the record"
      return ""
    }

    function getIcon(actionEnum: ReactionType) {
      if (actionEnum === ReactionType.TOGGLE_AUDIO_COMPRESSOR)
        return <AiOutlineSound />
      if (actionEnum === ReactionType.SCENE_SWITCH)
        return <MdPanoramaHorizontal />
      if (actionEnum === ReactionType.START_STREAM)
        return <AiOutlinePlayCircle />
      if (actionEnum === ReactionType.STOP_STREAM)
        return <AiOutlineStop />
      if (actionEnum === ReactionType.START_REC)
        return <AiFillVideoCamera />
      if (actionEnum === ReactionType.STOP_REC)
        return <AiOutlineVideoCamera />
      return <AiOutlineBug />
    }

    return (
      <>
        <div className="container events-container">

          <h2>List of Reactions</h2>

          {
            actionsList.length === 0 ? (
              <>
                <h4>No action found.</h4>
              </>
            ) : (
              <div className="reactions-list">
                <div className="item-container">
                {
                  actionsList.map((item: any, index: any) => {
                    return (
                      <Card key={index} className="card-event" sx={{ minWidth: 150, minHeight: 100, margin: 2 }}>
                        <CardContent>
                          <Typography variant="h5" component="div">
                            { getIcon(item.action) } "{ item.name }"
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            { getAction(item.action) }
                          </Typography>
                          <Typography variant="body2">
                            {
                              item.params ? 
                                Object.keys(item.params).map(key => {
                                  return `${key}: ${item.params[key]}`;
                                }).join("\n")
                                :
                                ""
                            }
                          </Typography>
                        </CardContent>
                        <CardActions disableSpacing className="rightAlignItem">
                          <IconButton onClick={() => deleteAction(item.id)} aria-label="delete">
                            <BsTrash />
                          </IconButton>
                        </CardActions>
                      </Card>
                    )
                  })
                }
                </div>
              </div>
            )
          }

        </div>

        <Link className="pt-20" to="/actions-reactions/home">Go Back</Link>

        <Dialog open={open} onClose={handleCancel}>
          <DialogTitle>Add Reaction</DialogTitle>
          <DialogContent>
            <DialogContentText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Aenean hendrerit, nisl ut mollis placerat, lorem risus feugiat purus, quis tincidunt nisi ipsum eu risus.
            Nulla at mollis tortor. Morbi accumsan mauris ac euismod tempor.
            Curabitur non consequat dolor. Nunc ut blandit tortor.
            Pellentesque viverra volutpat est, vel hendrerit neque elementum nec.
            </DialogContentText>

            <div className="form-item">
              <TextField
                autoFocus
                id="name"
                label="Name of the action"
                type="text"
                value={newActionName}
                variant="standard"
                onChange={(newValue) => setNewActionName(newValue.target.value)}
              />
            </div>

            <div className="form-item">
              <InputLabel id="select-event-label">Reaction</InputLabel>
              <Select
                labelId="select-event-label"
                id="select-event"
                value={newActionSelected}
                onChange={handleOnChangeSelect}
                autoWidth
                label="Action"
              >
                {
                  keysReactionType.map((k) => {
                    return (<MenuItem key={k} value={k}>{getAction(k)}</MenuItem>)
                  })
                }
              </Select>
            </div>

            <div className="form-item">
              <TextField
                id="parameter-action"
                label="Parameter action"
                type="text"
                variant="outlined"
                onChange={(action) => setNewActionParam(action.target.value)}
              />
            </div>

          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogActions>
        </Dialog>

        <div className="add_button_pos">
          <Button variant="contained" className="add_button" onClick={handleClickOpen}
          >
            Add Reaction
          </Button>
        </div>
      </>
    );
}
