import { Box, Button, CardContent, Typography } from "@mui/material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import React, { useEffect, useState } from "react";

import { AllMics, resultFormat, AllScenes, Scene, actionReactionFormat  } from "../../Socket/interfaces";
import { toast } from "react-toastify";

import useAuth from "../../hooks/useAuth.js";
import { action_reaction } from "../ActionsReactions/AppLaunch/AppLaunch";

const ipcRenderer = window.require("electron").ipcRenderer;

export interface Save {
  saveName: string;
  actions: Action[];
  reactions: Reaction[];
  mics: Mic[];
  changeScene: null;
}

export interface Action {
  name: string;
  wordDetection?: WordDetection;
  keyPressed?: KeyPressed;
  appLaunch?: AppLaunch;
}

export interface AppLaunch {
  appName: string;
}

export interface KeyPressed {
  key: string;
}

export interface WordDetection {
  keyWord: string;
}

export interface Mic {
  name: string;
  level: string;
  isActive: boolean;
}

export interface Reaction {
  reactionName: string;
  reactionType: string;
  reactionValue: string;
}

export interface MicCompressor {
  micName: string;
  level: number;
  isActive: boolean;
}

const invalidColor = "#FF0000";
const validColor = "#00a200";

const DisplayMic = (props: any) => {
  return (
    <li>
      <Box
        sx={{
          color: props.color,
          alignItems: "center",
          display: "flex",
        }}
      >
        <Typography
          sx={{ color: props.color, marginRight: "10px" }}
          variant="h6"
        >
          {props.name}
        </Typography>
        <props.icon />
      </Box>
    </li>
  );
};


const DisplayMics = (props: { mics: Mic[], micsOBS: MicCompressor[] | undefined }) => {
  const { mics, micsOBS } = props;

  const MicsIcon = (micsName: string, micsOBS: MicCompressor[] | undefined) => {
    const icon = micsOBS?.some((mic: MicCompressor) => micsName === mic.micName) ? CheckCircleOutlineRoundedIcon : CancelRoundedIcon;
    return icon;
  }

  const MicsColor = (micsName: string, micsOBS: MicCompressor[] | undefined) => {
    const icon = micsOBS?.some((mic: MicCompressor) => micsName === mic.micName) ? validColor : invalidColor;
    return icon;
  }

  return (
    <>
      {mics.length > 0 ? (
        <>
          <Typography sx={{ fontWeight: "bold" }} variant="h4">
            {"Mics"}
          </Typography>
          <ul>
            {mics.map((mic: any, key) => {
              return (
                <DisplayMic
                  key={key}
                  color={MicsColor(mic.name, micsOBS)}
                  icon={MicsIcon(mic.name, micsOBS)}
                  name={mic.name}
                />
              );
            })}
          </ul>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

const DisplayAction = (props: any) => {
  return (
    <li>
      <Box
        sx={{
          color: props.color,
          alignItems: "center",
          display: "flex",
        }}
      >
        <Typography
          sx={{ color: props.color, marginRight: "10px" }}
          variant="h6"
        >
          {props.name}
        </Typography>
        <props.icon />
      </Box>
    </li>
  );
}

const DisplayActions = (props: { actions: Action[] }) => {
  const { actions } = props;

  const actionParams = (action: Action) => {
    if (action.wordDetection) {
      return action.wordDetection.keyWord;
    } else if (action.keyPressed) {
      return action.keyPressed.key;
    } else if (action.appLaunch) {
      return action.appLaunch.appName;
    }
  }

  return (
    <>
      {actions.length > 0 ? (
        <>
          <Typography sx={{ fontWeight: "bold" }} variant="h4">
            {"Actions"}
          </Typography>
          <ul>
            {actions.map((action: Action, key) => {
              return (
                <DisplayAction
                  key={key}
                  color={validColor}
                  icon={CheckCircleOutlineRoundedIcon}
                  name={action.name + " : " + actionParams(action)}
                />
              );
            })}
          </ul>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

const DisplayReaction = (props: any) => {
  return (
    <li>
      <Box
        sx={{
          color: props.color,
          alignItems: "center",
          display: "flex",
        }}
      >
        <Typography
          sx={{ color: props.color, marginRight: "10px" }}
          variant="h6"
        >
          {props.name + " : " + props.reactionValue}
        </Typography>
        <props.icon />
      </Box>
    </li>
  );
}

const DisplayReactions = (props: { reactions: Reaction[], scenesOBS: Scene[] | undefined }) => {
  const { reactions, scenesOBS } = props;

  const ReactionIcon = (reactionType: string, reactionValue: string,) => {
    if (reactionType === "SCENE_SWITCH") {
      const icon = scenesOBS?.some((scene: Scene) => scene.name === reactionValue ) ? CheckCircleOutlineRoundedIcon : CancelRoundedIcon;
      return icon;
    }
    return CheckCircleOutlineRoundedIcon;
  }

  const ReactionColor = (reactionType: string, reactionValue: string,) => {
    if (reactionType === "SCENE_SWITCH") {
      const icon = scenesOBS?.some((scene: Scene) => scene.name === reactionValue ) ? validColor : invalidColor;
      return icon;
    }
    return validColor;
  }

  return (
    <>
      {reactions.length > 0 ? (
        <>
          <Typography sx={{ fontWeight: "bold" }} variant="h4">
            {"Reactions"}
          </Typography>
          <ul>
            {reactions.map((reaction: Reaction, key) => {
              return (
                <DisplayReaction
                  key={key}
                  color={ReactionColor(reaction.reactionType, reaction.reactionValue)}
                  icon={ReactionIcon(reaction.reactionType, reaction.reactionValue)}
                  name={reaction.reactionName}
                  reactionValue={reaction.reactionValue}
                />
              );
            })}
          </ul>
        </>
      ) : (
        <></>
      )}
    </>
  );
}


export const ModalSave = (props: any) => {
  const axiosPrivate = useAxiosPrivate();
  const [saves, setSaves] = useState<Save[]>();
  const [saveIndex, setSaveIndex] = useState(0);
  const [load, setload] = useState(false);
  const [exampleCompressorArray, setExampleCompressorArray] = useState<MicCompressor[]>();
  const [obsScenes, setObsScenes] = useState<Scene[]>();

  // call get save at the beginning of the component
  useEffect(() => {
      getSave();
      loadMics();
      loadScenes();
  }, []);

  useEffect(() => {
    // This code will run when exampleCompressorArray changes.
  }, [exampleCompressorArray, obsScenes]);
  
  const loadMics = async () => {
    getAllCompressors().then((res) => {
      if (res.statusCode === 200) {
        setExampleCompressorArray(res.data.mics);
        toast("Got OBS mics !", {
          type: "success",
        });
      } else {
        toast("Cannot get OBS Mics", {
          type: "error",
        });
      }
    });
  }

  const getAllCompressors = (): Promise<AllMics> => {
    return new Promise(async (resolve) => {
      const result: AllMics = await ipcRenderer.sendSync("/microphones/get", "ping");
      resolve(result);
    });
  };

  const loadScenes = async () => {
    getAllScenes().then((res) => {
      if (res.statusCode === 200) {
        setObsScenes(res.data.scenes);
        toast("Got OBS scenes !", {
          type: "success",
        });
      } else {
        toast("Cannot get OBS scenes", {
          type: "error",
        });
      }
    });
  }

  const getAllScenes = (): Promise<AllScenes> => {
    return new Promise(async (resolve, reject) => {
      const result: AllScenes = await ipcRenderer.sendSync("/scenes/get", "ping");
      resolve(result);
    });
  };

  const setVolumeToCompressor = (mic: Mic): Promise<resultFormat> => {
    return new Promise(async (resolve, reject) => {
      const result: resultFormat = await ipcRenderer.sendSync(
        "/microphones/auto-leveler/set",
        {
          level: parseInt(mic.level),
          micName: mic.name,
          isActive: mic.isActive,
        }
      );
      resolve(result);
      toast("Saved loaded", {
        type: "success",
      });
    });
  };

  const getSave = async () => {
    const response = await axiosPrivate.get("/users/getSaveUserFeatures");
    setSaves(response.data.saves);
    setSaveIndex(response.data.saves.length - 1);
  };

  const sendActionReactionToServer = (newActionReaction: action_reaction): Promise<actionReactionFormat> => {
    return new Promise(async (resolve, reject) => {
      const result: actionReactionFormat = await ipcRenderer.sendSync("/areas/create", newActionReaction);
      resolve(result);
    });
  };

  const loadSave = async (mics: Mic[], action: Action[], reaction: Reaction[]) => {
    mics.forEach((mic: Mic) => {
      setVolumeToCompressor(mic);
    });
    action.forEach((action: Action, index) => {
      if (action.wordDetection) {
        toast("Word detection is not implemented yet", {
          type: "error",
        });
        sendActionReactionToServer({
          action: {
            type: "WORD_DETECTION",
            params: {
              key_word: action.wordDetection.keyWord,
            },
          },
          reaction: {
            name: reaction[index].reactionName,
            type: reaction[index].reactionType,
            params: {
              reaction_value: reaction[index].reactionValue,
            },
          },
        }).then((res) => {
          if (res.statusCode === 200) {
            console.log("updateActionReactionArray", res);
            toast("Action & Reaction submitted successfully !", {
              type: "success",
            });
          } else {
            toast("Error server.", {
              type: "error",
            });
          }
        });
        console.log(action.wordDetection, reaction[index])
      } else if (action.keyPressed) {
        toast("Key pressed is not implemented yet", {
          type: "error",
        });
        console.log(action.keyPressed, reaction[index])
        sendActionReactionToServer({
          action: {
            type: "KEY_PRESSED",
            params: {
              key: action.keyPressed.key,
            },
          },
          reaction: {
            name: reaction[index].reactionName,
            type: reaction[index].reactionType,
            params: {
              reaction_value: reaction[index].reactionValue,
            },
          },
        }).then((res) => {
          if (res.statusCode === 200) {
            console.log("updateActionReactionArray", res);
            toast("Action & Reaction submitted successfully !", {
              type: "success",
            });
          } else {
            toast("Error server.", {
              type: "error",
            });
          }
        })
      } else if (action.appLaunch) {
        toast("App launch is not implemented yet", {
          type: "error",
        });
        sendActionReactionToServer({
          action: {
            type: "APP_LAUNCH",
            params: {
              app_name: action.appLaunch.appName,
            },
          },
          reaction: {
            name: reaction[index].reactionName,
            type: reaction[index].reactionType,
            params: {
              reaction_value: reaction[index].reactionValue,
            },
          },
        }).then((res) => {
          if (res.statusCode === 200) {
            console.log("updateActionReactionArray", res);
            toast("Action & Reaction submitted successfully !", {
              type: "success",
            });
          } else {
            toast("Error server.", {
              type: "error",
            });
          }
        });
        console.log(action.appLaunch, reaction[index])
      }
    }
    );
  };

  return (
    <>
      <div
        style={{
          marginLeft: "30vw",
          marginTop: "10vh",
          width: "40vw",
          height: "80vh",
          border: "3px solid orange",
          backgroundColor: "#222831",
          borderRadius: "15px",
          overflow: 'auto',
        }}
      >
        {saves !== undefined && saves.length > 0 ? (
          <Box
            sx={{
              color: "white",
              padding: "2vh",
              paddingBottom: "15px !important",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: "5vh",
                paddingBottom: "5vh",
              }}
              variant="h2"
            >
              {saves[saveIndex].saveName}
            </Typography>
            <DisplayMics mics={saves[saveIndex].mics} micsOBS={exampleCompressorArray} />
            <DisplayActions actions={saves[saveIndex].actions} />
            <DisplayReactions reactions={saves[saveIndex].reactions} scenesOBS={obsScenes} />
              <Button onClick={() => loadSave(saves[saveIndex].mics, saves[saveIndex].actions, saves[saveIndex].reactions)}> Load </Button>
              <Button onClick={() => {loadMics(); loadScenes()}}> Reload </Button>
              <Button onClick={props.handleClose}> Close</Button>
          </Box>
        ) : (
          <Box>
            <Typography
              sx={{
                color: "white",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: "30vh",

                fontWeight: "bold",
              }}
              variant="h3"
            >
              Nothing saved.
            </Typography>
          </Box>
        )}
      </div>
    </>
  );
};
