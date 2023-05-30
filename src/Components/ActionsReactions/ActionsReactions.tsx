import React, { Component, useEffect, useState } from "react";
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
import { getActReactCouplesFormat, actionReactionFormat, removeActReactAnswer } from '../../Socket/interfaces';
import { ActionType, action_reaction, action_reaction_identified } from "./WordDetection/WordDetection";
const ipcRenderer = window.require('electron').ipcRenderer

export enum ReactionType {
    CAMERA_SWITCH = "CAMERA_SWITCH",
    SCENE_SWITCH = "SCENE_SWITCH",
    START_LIVE = "START_LIVE",
    STOP_LIVE = "STOP_LIVE",
    TOGGLE_AUDIO_COMPRESSOR = "TOGGLE_AUDIO_COMPRESSOR"
  }

export const ActionsReactions = () => {
  const [ actionsReactionsList, setActionsReactionsList ] = React.useState<action_reaction_identified[]>([])

  // Loading
  const [load, setload] = React.useState(true);
  const [point, setpoint] = React.useState(".");

  const updateActionReactionArray = () => {
    getActionReactionFromServer()
    .then(res => {
      if (res.statusCode === 200) {
        console.log("New Array", res);
        setActionsReactionsList(res.data.actReacts)
      }
    });
  }

  const getActionReactionFromServer = (): Promise<getActReactCouplesFormat> => {
    return new Promise(async (resolve, reject) => {
			const result: getActReactCouplesFormat = await ipcRenderer.sendSync('getActReactCouples', 'ping');
			resolve(result);
		});
  }

  const removeActionReactionFromServer = (actionReactionId: number): Promise<removeActReactAnswer> => {
    return new Promise(async (resolve, reject) => {
			const result: removeActReactAnswer = await ipcRenderer.sendSync('removeActReact', { "actReactId": actionReactionId });
			resolve(result);
		});
  }

  const removeActionReaction = (actionReactionId: number) => {
    removeActionReactionFromServer(actionReactionId)
    .then(res => {
      if (res.statusCode === 200) {
        
        // Update actions & reactions
        getActionReactionFromServer()
        .then(res => {
          if (res.statusCode === 200) {
            console.log("New Array", res);
            setActionsReactionsList(res.data.actReacts)
          }
        })
        
        alert("Action Reaction has been deleted successfully")
      } else {
        alert("Internal error.")
      }
    })
    return 0
  }

  useEffect(() => {
    async function sleep(): Promise<boolean> {
      return new Promise((resolve) => {
        getActionReactionFromServer()
        .then(res => {
          if (res.statusCode === 200) {
            console.log("New Array", res);
            setActionsReactionsList(res.data.actReacts)
            resolve(false);
          }
        })
      })
    }
    
    sleep().then((res) => setload(res));
  }, []);

  function addpoint() {
    {setInterval(() => {
      (point.length >= 3 ? setpoint(".") : setpoint(point + "."));
    }, 1000)}
  }

  const interpret_action = (type: ActionType, params: any) => {
    if (type === "WORD_DETECT") {
      let words = params.words.join(" or ")
      return "If you say " + words
    } else if (type === "APP_LAUNCH") {
      return "If the application " + params.app_name + " launches"
    } else if (type === "KEY_PRESSED") {
      let key = params.key
      return 'If you type the touch "' + key + '"'
    } else {
      return "ERROR"
    }
  }

  const get_action_type = (type: ActionType) => {
    if (type === "WORD_DETECT") {
      return "Word Detection"
    } else if (type === "APP_LAUNCH") {
      return "Application Launch"
    } else if (type === "KEY_PRESSED") {
      return "Key Pressed"
    } else {
      return "ERROR"
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
        <div className="container events-container">
          <h2>List of Actions & Reactions</h2>

          {
          actionsReactionsList.length === 0 ? (
            <>
              <h4>No Action & Reaction found.</h4>
            </>
          )
          :
          (
            <div className="actions-reactions-list">
              <div className="item-container action-reaction-cards">
                {
                  actionsReactionsList.map((item: any, index: any) => {
                    return (
                      <Card
                        key={index}
                        className="card-event"
                      >
                        <CardContent>
                          <Typography variant="h5" component="div">
                            { get_action_type(item.action.type) } #{item.actReactId}
                          </Typography>
                          <Typography variant="body2">
                            Action: { interpret_action(item.action.type, item.action.params) }
                            <br></br>
                            Reaction: { item.reaction.name }
                          </Typography>
                        </CardContent>
                        <CardActions disableSpacing className="rightAlignItem">
                          <IconButton
                            onClick={() => removeActionReaction(item.actReactId)}
                            aria-label="delete"
                          >
                            <BsTrash />
                          </IconButton>
                        </CardActions>
                      </Card>
                    );
                  })
                }
              </div>
            </div>
          )
          }
        </div>

        <div className="create_actions_button_pos">
          <Link className="m-2" to="/actions-reactions/actions">Create Actions</Link>
        </div>

        <div className="create_reactions_button_pos">
          <Link className="m-2" to="/actions-reactions/reactions">Create Reactions</Link>
        </div>
      </>
      )
    }
    </>
  );
};
