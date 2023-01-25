import React from "react";
import "./ActionsReactions.css";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  AiOutlineBug,
  AiOutlinePlayCircle,
  AiOutlineSound,
  AiOutlineStop,
  AiOutlineVideoCamera,
} from "react-icons/ai";
import { MdPanoramaHorizontal } from "react-icons/md";
import {
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { BsTrash } from "react-icons/bs";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { LocalStorage } from "../../LocalStorage/LocalStorage";
import { Link } from "react-router-dom";

export enum ReactionType {
    CAMERA_SWITCH = "CAMERA_SWITCH",
    SCENE_SWITCH = "SCENE_SWITCH",
    START_LIVE = "START_LIVE",
    STOP_LIVE = "STOP_LIVE",
    TOGGLE_AUDIO_COMPRESSOR = "TOGGLE_AUDIO_COMPRESSOR"
  }

export const ActionsReactions = () => {
  const [actionsList, setActionsList] = React.useState([]);

  const blop = () => {
    return 0;
  };

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
        <h2>List of Actions & Reactions</h2>

        {actionsList.length === 0 ? (
          <>
            <h4>No Action & Reaction found.</h4>
          </>
        ) : (
          actionsList.map((item: any, index: any) => {
            return (
              <Card
                key={index}
                className="card-event"
                sx={{ minWidth: 150, minHeight: 100, margin: 2 }}
              >
                <CardContent>
                  <Typography variant="h5" component="div">
                    {getIcon(item.action)} "{item.name}"
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {getAction(item.action)}
                  </Typography>
                  <Typography variant="body2">
                    {item.params
                      ? Object.keys(item.params)
                          .map((key) => {
                            return `${key}: ${item.params[key]}`;
                          })
                          .join("\n")
                      : ""}
                  </Typography>
                </CardContent>
                <CardActions disableSpacing className="rightAlignItem">
                  <IconButton
                    onClick={() => blop()}
                    aria-label="delete"
                  >
                    <BsTrash />
                  </IconButton>
                </CardActions>
              </Card>
            );
          })
        )}
      </div>

      <div className="create_actions_button_pos">
        <Link className="m-2" to="/actions-reactions/actions">Create Actions</Link>
      </div>

      <div className="create_reactions_button_pos">
        <Link className="m-2" to="/actions-reactions/reactions">Create Reactions</Link>
      </div>
    </>
  );
};
