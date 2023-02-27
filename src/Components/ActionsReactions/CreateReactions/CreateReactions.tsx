import React from 'react';
import './CreateReactions.css';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { AiOutlineBug, AiOutlinePlayCircle, AiOutlineSound, AiOutlineStop, AiOutlineVideoCamera } from 'react-icons/ai';
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

import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const SAVE_GENERATE_EVENT_URL = "/applicationSavedFeature/saveGenerateEvent";

export enum ReactionType {
  CAMERA_SWITCH = "CAMERA_SWITCH",
  SCENE_SWITCH = "SCENE_SWITCH",
  START_LIVE = "START_LIVE",
  STOP_LIVE = "STOP_LIVE",
  TOGGLE_AUDIO_COMPRESSOR = "TOGGLE_AUDIO_COMPRESSOR"
}

export const CreateReactions = () => {

    const keysReactionType = Object.keys(ReactionType);

    const [open, setOpen] = React.useState(false);
    const [newActionName, setNewActionName] = React.useState("");
    const [newActionSelected, setNewActionSelected] = React.useState("CAMERA_SWITCH");
    const [newActionParam, setNewActionParam] = React.useState("")

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
    }

    const save = () => {
      const generateEvents = actionsList.map((action: any) => {
        
        let parameter = '';
        if (action.action === ReactionType.TOGGLE_AUDIO_COMPRESSOR)
            parameter = "audio_source";
          if (action.action === ReactionType.CAMERA_SWITCH)
            parameter = "video_source";
          if (action.action === ReactionType.SCENE_SWITCH)
            parameter = "scene_name";
          if (action.action === ReactionType.START_LIVE)
            parameter = "seconds";
          if (action.action === ReactionType.STOP_LIVE)
            parameter = "seconds";

        return {
          name: action.name,
          action: action.action,
          parameter,
        }
      })
      console.log(generateEvents)
      axiosPrivate.post(SAVE_GENERATE_EVENT_URL, {
        generateEvents,
        headers: { "Content-Type": "application/json" },
        // withCredentials: true,
      });
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
          if (newActionSelected === ReactionType.CAMERA_SWITCH)
            newElem.params = { "video_source": newActionParam };
          if (newActionSelected === ReactionType.SCENE_SWITCH)
            newElem.params = { "scene": newActionParam };
          if (newActionSelected === ReactionType.START_LIVE)
            newElem.params = { "seconds": newActionParam };
          if (newActionSelected === ReactionType.STOP_LIVE)
            newElem.params = { "seconds": newActionParam };
        }

        const newList = actionsList.concat([newElem]);

        setActionsList(newList);
        LocalStorage.setItemObject("actionsList", newList)
        alert("Reaction saved");
      } else {
        // Put alert
        alert("Missing parameters");
      }
      setNewActionName("");
      setNewActionSelected("CAMERA_SWITCH");
      setNewActionParam("");
      setOpen(false);
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
      if (actionEnum === ReactionType.CAMERA_SWITCH)
        return "Change the camera"
      if (actionEnum === ReactionType.SCENE_SWITCH)
        return "Change the scene"
      if (actionEnum === ReactionType.START_LIVE)
        return "Start the live"
      if (actionEnum === ReactionType.STOP_LIVE)
        return "Stop the live"
      return ""
    }

    function getIcon(actionEnum: ReactionType) {
      if (actionEnum === ReactionType.TOGGLE_AUDIO_COMPRESSOR)
        return <AiOutlineSound />
      if (actionEnum === ReactionType.CAMERA_SWITCH)
        return <AiOutlineVideoCamera />
      if (actionEnum === ReactionType.SCENE_SWITCH)
        return <MdPanoramaHorizontal />
      if (actionEnum === ReactionType.START_LIVE)
        return <AiOutlinePlayCircle />
      if (actionEnum === ReactionType.STOP_LIVE)
        return <AiOutlineStop />
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
            ) : (actionsList.map((item: any, index: any) => {
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
            }))
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
              <InputLabel id="select-event-label">Action</InputLabel>
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
        <Button
          variant="outlined"
          sx={style.Button}
          onClick={save}
        >
          {" "}
          Save{" "}
        </Button>
      </>
    );
}
