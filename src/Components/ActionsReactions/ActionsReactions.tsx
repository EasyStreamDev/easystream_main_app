import React, { useEffect } from "react";
import "./ActionsReactions.css";

import { Button, IconButton, Tooltip } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {
  BsArrowLeft,
  BsArrowRight,
  BsBug,
  BsFillExclamationTriangleFill,
  BsKeyboard,
  BsMic,
  BsRocketTakeoff,
  BsTrash,
} from "react-icons/bs";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AllScenes, Scene, getActReactCouplesFormat, removeActReactAnswer } from "../../Socket/interfaces";
const ipcRenderer = window.require("electron").ipcRenderer;

export enum ReactionType {
  CAMERA_SWITCH = "CAMERA_SWITCH",
  SCENE_SWITCH = "SCENE_SWITCH",
  START_LIVE = "START_LIVE",
  STOP_LIVE = "STOP_LIVE",
  TOGGLE_AUDIO_COMPRESSOR = "TOGGLE_AUDIO_COMPRESSOR",
}

export enum ActionType {
  WORD_DETECT = "WORD_DETECT", // Enum for different action types
  APP_LAUNCH = "APP_LAUNCH",
  KEY_PRESSED = "KEY_PRESSED",
}

export interface action_reaction_identified {
  actReactId: number; // Unique identifier for an action-reaction pair
  isActive: boolean; // Flag indicating whether the action-reaction pair is active or not
  action: {
    actionId: number; // Unique identifier for an action
    type: string; // Type of action
    params?: any; // Optional parameters for the action
  };
  reaction: {
    reactionId: number; // Unique identifier for a reaction
    type: string; // Type of reaction
    params?: any; // Optional parameters for the reaction
  };
}

export const ActionsReactions = () => {
  const [actionsReactionsList, setActionsReactionsList] = React.useState<action_reaction_identified[]>([]);
  const [availableScenes, setAvailableScenes] = React.useState<Scene[]>([]);

  // Loading
  const [load, setload] = React.useState(true);
  const [point, setpoint] = React.useState(".");

  /**
   * Function to update the array of actions and reactions from the server
   */
  const updateActionReactionArray = () => {
    getActionReactionFromServer().then((res) => {
      if (res.statusCode === 200) {
        console.log("New Array", res);
        setActionsReactionsList(res.data.actReacts);
      }
    });
  };

  /**
   * Function to retrieve the actions and reactions from the server
   * @returns
   */
  const getActionReactionFromServer = (): Promise<getActReactCouplesFormat> => {
    return new Promise(async (resolve, reject) => {
      const result: getActReactCouplesFormat = await ipcRenderer.sendSync("getActReactCouples", "ping");
      resolve(result);
    });
  };

  /**
   * Function to remove an action and reaction from the server
   * @param actionReactionId
   * @returns
   */
  const removeActionReactionFromServer = (actionReactionId: number): Promise<removeActReactAnswer> => {
    return new Promise(async (resolve, reject) => {
      const result: removeActReactAnswer = await ipcRenderer.sendSync("removeActReact", {
        actReactId: actionReactionId,
      });
      resolve(result);
    });
  };

  /**
   * Function to remove an action and reaction
   * @param actionReactionId
   * @returns
   */
  const removeActionReaction = (actionReactionId: number) => {
    removeActionReactionFromServer(actionReactionId).then((res) => {
      if (res.statusCode === 200) {
        // Update actions & reactions
        getActionReactionFromServer().then((res) => {
          if (res.statusCode === 200) {
            console.log("New Array", res);
            setActionsReactionsList(res.data.actReacts);
          }
        });

        toast("Action Reaction has been deleted successfully.", {
          type: "success",
        });
      } else {
        toast("Internal error.", {
          type: "error",
        });
      }
    });
    return 0;
  };

  // Hook to load actions and reactions on component mount
  useEffect(() => {
    const handleActionReactionUpdated = (evt: any, message: any) => {
      getActionReactionFromServer().then((res) => {
        if (res.statusCode === 200) {
          toast("Actions/Reactions have been updated !", {
            type: "info",
          });
          console.log("New Array", res);
          setActionsReactionsList(res.data.actReacts);
        }
      });
    };
    const handleScenesUpdated = (evt: any, message: any) => {
      getAllScenes().then((res) => {
        if (res.statusCode === 200) {
          toast("Scenes have been updated.", {
            type: "info",
          });
          setAvailableScenes(res.data.scenes);
        }
      });
    };

    ipcRenderer.on("actions-reactions-updated", handleActionReactionUpdated);
    ipcRenderer.on("scenes-updated", handleScenesUpdated);

    async function sleep(): Promise<boolean> {
      return new Promise((resolve) => {
        getActionReactionFromServer().then((res) => {
          if (res.statusCode === 200) {
            console.log("New Array", res);
            setActionsReactionsList(res.data.actReacts);

            getAllScenes().then((res) => {
              if (res.statusCode === 200) {
                setAvailableScenes(res.data.scenes);
                console.log("Scenes", res);
                resolve(true);
              } else {
                toast("Error loading available scenes.", {
                  type: "error",
                });
                resolve(false);
              }
            });
          } else {
            toast("Error listing all actions reactions. Verify the internet connection", {
              type: "error",
            });
            resolve(false);
          }
        });
      });
    }

    sleep().then((res) => setload(!res));

    return () => {
      ipcRenderer.removeListener("actions-reactions-updated", handleActionReactionUpdated);
      ipcRenderer.removeListener("scenes-updated", handleScenesUpdated);
    };
  }, []);

  /**
   * Function to add points to the loading text
   */
  function addpoint() {
    {
      setInterval(() => {
        point.length >= 3 ? setpoint(".") : setpoint(point + ".");
      }, 1000);
    }
  }

  /**
   * Function to interpret the action type
   * @param type
   * @param params
   * @returns
   */
  const interpret_action = (type: ActionType, params: any) => {
    if (type === "WORD_DETECT") {
      let words = params.words.join(" or ");
      return (
        <>
          If you say <b>{words}</b>
        </>
      );
    } else if (type === "APP_LAUNCH") {
      return (
        <>
          If the application <b>{params.app_name}</b> launches
        </>
      );
    } else if (type === "KEY_PRESSED") {
      let key = params.key;
      return (
        <>
          If you type the key <b>{key}</b>
        </>
      );
    } else {
      return "ERROR";
    }
  };

  /**
   * Function to get the action type
   * @param type
   * @returns
   */
  const get_action_type = (type: ActionType) => {
    if (type === "WORD_DETECT") {
      return "Word Detection";
    } else if (type === "APP_LAUNCH") {
      return "Application Launch";
    } else if (type === "KEY_PRESSED") {
      return "Key Pressed";
    } else {
      return "ERROR";
    }
  };

  /**
   * Function to get the icon from type
   * @param type
   * @returns
   */
  const get_action_icon = (type: ActionType) => {
    if (type === "WORD_DETECT") {
      return <BsMic />;
    } else if (type === "APP_LAUNCH") {
      return <BsRocketTakeoff />;
    } else if (type === "KEY_PRESSED") {
      return <BsKeyboard />;
    } else {
      return <BsBug />;
    }
  };

  /**
   * Get All Scenes
   * @returns
   */
  const getAllScenes = (): Promise<AllScenes> => {
    return new Promise(async (resolve, reject) => {
      const result: AllScenes = await ipcRenderer.sendSync("getAllScenes", "ping");
      resolve(result);
    });
  };

  /**
   * Function to know if a scene not available
   * @param item
   * @returns
   */
  const warningMessageDisplaySceneMissing = (item: action_reaction_identified) => {
    // check if SCENE_SWITCH
    if (item.reaction.type === ReactionType.SCENE_SWITCH) {
      console.log("item", item);
      // check if uuid is in available scenes
      let tmp = true;
      availableScenes.forEach((element) => {
        if (item.reaction.params && item.reaction.params.uuid) {
          if (element.uuid === item.reaction.params.uuid) {
            tmp = false;
          }
        }
      });
      return tmp;
    } else {
      return false;
    }
  };

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

            {actionsReactionsList.length === 0 ? (
              <>
                <h4>No Action & Reaction found.</h4>
              </>
            ) : (
              <div className="actions-reactions-list non-dragable">
                <div className="item-container action-reaction-cards non-dragable">
                  {actionsReactionsList.map((item: any, index: any) => {
                    return (
                      <Card key={index} className="card-event non-dragable" sx={{
                        backgroundColor: "#565d68",
                        border: "2px solid orange",
                        borderRadius: "10px",
                        color: "white",
                        height: "100%",
                        display: "inline-table",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "85%"
                      }}>
                        <CardContent>
                          <Typography sx={{ fontSize: 14 }} gutterBottom>
                            # {index + 1}
                          </Typography>
                          <Typography variant="h4" component="div">
                            <div className="top-card">
                              <div className="icon-card">{get_action_icon(item.action.type)}</div>
                              <div>{get_action_type(item.action.type)}</div>
                            </div>
                          </Typography>
                          <Typography variant="body1">
                            {interpret_action(item.action.type, item.action.params)}
                            <br></br>
                            Then, <b>{item.reaction.name}</b>
                          </Typography>
                        </CardContent>
                        <CardActions disableSpacing className="rightAlignItem">
                          {warningMessageDisplaySceneMissing(item) === true ? (
                            <Tooltip title="The scene that is registered in the reaction of this Action/Reaction isn't available anymore. Please delete this Action/Reaction.">
                              <IconButton
                                className="full-orange"
                              >
                                <BsFillExclamationTriangleFill />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <div></div>
                          )}
                          <IconButton
                            onClick={() => removeActionReaction(item.actReactId)}
                            aria-label="delete"
                            sx={{
                              ":hover": {
                                backgroundColor: "transparent",
                                transform: "scale(1.2)",
                              },
                            }}
                          >
                            <BsTrash color="white" />
                          </IconButton>
                        </CardActions>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="create_actions_button_pos">
            <Link className="m-2" to="/actions-reactions/actions">
              <Button className="button-color-orange" variant="outlined" startIcon={<BsArrowLeft />}>
                Create Actions
              </Button>
            </Link>
          </div>

          <div className="create_reactions_button_pos">
            <Link className="m-2" to="/actions-reactions/reactions">
              <Button className="button-color-orange" variant="outlined" endIcon={<BsArrowRight />}>
                Create Reactions
              </Button>
            </Link>
          </div>
        </>
      )}
    </>
  );
};
