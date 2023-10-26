import React, { Component, useEffect, useState } from "react";
import { AddAppLaunch } from "../AddAppLaunch/AddAppLaunch";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@mui/material/Button";
import "./AppLaunch.css";

import { BsArrowReturnLeft } from "react-icons/bs";

import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

import BoxEvent from "../../BoxEvent/BoxEvent";
import { LocalStorage } from "../../../LocalStorage/LocalStorage";
import { getActReactCouplesFormat, actionReactionFormat, removeActReactAnswer } from "../../../Socket/interfaces";
const ipcRenderer = window.require("electron").ipcRenderer;

/**
 * Define an enum for action types
 */
export enum ActionType {
  WORD_DETECT = "WORD_DETECT",
  APP_LAUNCH = "APP_LAUNCH",
  KEY_PRESSED = "KEY_PRESSED",
}

/**
 * Define interfaces for identified action-reaction pairs
 */
export interface action_reaction_identified {
  actReactId: number;
  isActive: boolean;
  action: {
    actionId: number;
    type: string;
    params?: Object;
  };
  reaction: {
    reactionId: number;
    type: string;
    params?: Object;
  };
}

/**
 * Define an interface for action-reaction pairs
 */
export interface action_reaction {
  action: {
    type: string;
    params?: Object;
  };
  reaction: {
    name: string;
    type: string;
    params?: Object;
  };
}

/**
 * Define an interface for events
 */
interface event {
  id: number;
  keywords: String[];
  source: {
    id?: number;
    name?: String;
    action?: ActionType;
    param_value?: number;
  };
}

/**
 * Define the AppLaunch component
 * @param props
 * @returns
 */
export const AppLaunch = (props: any) => {
  // State variables
  const [action_reactionArray, setaction_reactionArray] = React.useState<action_reaction_identified[]>([]);
  const [newEvent, setnewEvent] = React.useState<event>({
    id: action_reactionArray.length,
    keywords: [],
    source: {},
  });
  const [sources] = React.useState(LocalStorage.getItemObject("actionsList") || []);
  const [load, setload] = React.useState(true);
  const [point, setpoint] = React.useState(".");
  const axiosPrivate = useAxiosPrivate();

  /**
   * Define the style object
   */
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
  };

  /**
   * Function to update the action-reaction array
   */
  const updateActionReactionArray = () => {
    getActionReactionFromServer().then((res) => {
      if (res.statusCode === 200) {
        console.log("updateActionReactionArray", res);
        setaction_reactionArray(res.data.actReacts);
      }
    });
  };

  /**
   * Function to get action-reaction pairs from the server
   * @returns
   */
  const getActionReactionFromServer = (): Promise<getActReactCouplesFormat> => {
    return new Promise(async (resolve, reject) => {
      const result: getActReactCouplesFormat = await ipcRenderer.sendSync("getActReactCouples", "ping");
      resolve(result);
    });
  };

  /**
   * Function to send an action-reaction pair to the server
   * @param newActionReaction
   * @returns
   */
  const sendActionReactionToServer = (newActionReaction: action_reaction): Promise<actionReactionFormat> => {
    return new Promise(async (resolve, reject) => {
      const result: actionReactionFormat = await ipcRenderer.sendSync("setActionReaction", newActionReaction);
      resolve(result);
    });
  };

  /**
   * Function to add a new event
   * @param event
   */
  function addNewEvent(event: any) {
    let newActionReaction: action_reaction = {
      action: {
        type: ActionType.APP_LAUNCH as string,
        params: {
          app_name: event.keywords[0], // ! Careful
        },
      },
      reaction: {
        name: event.source.name,
        type: event.source.action,
        params: event.source.params,
      },
    };

    console.log("New action sent to server", newActionReaction);
    sendActionReactionToServer(newActionReaction).then((res) => {
      if (res.statusCode === 200) {
        updateActionReactionArray();
        toast("Action & Reaction submitted successfully !", {
          type: "success",
        });
      } else {
        toast("Error server.", {
          type: "error",
        });
      }
    });
  }

  /**
   * Function to find a deleted element in an array
   * @param originalArray
   * @param newArray
   * @returns
   */
  function findDeletedElement(originalArray: any[], newArray: any[]): any | undefined {
    const newSet = new Set(newArray);
    for (const element of originalArray) {
      if (!newSet.has(element)) {
        return element;
      }
    }
    return undefined;
  }

  /**
   * Function to remove and update an action-reaction pair
   * @param params
   * @param eventArr
   * @returns
   */
  const removeAndUpdateActReaction = (params: any, eventArr: any) => {
    return new Promise(async (resolve, reject) => {
      const result: removeActReactAnswer = await ipcRenderer.sendSync("removeActReact", params);
      if (result.statusCode === 200) {
        console.log("Remove ActReaction", result.data.actReactId);
        updateActionReactionArray();
        toast("Remove Action & Reaction successfully done !", {
          type: "success",
        });
      } else {
        toast("Error server. Please check connection.", {
          type: "error",
        });
      }
    });
  };

  /**
   * Function to update the event from BoxEvent component
   * @param eventArr
   */
  function updateEventFromBoxEvent(eventArr: any) {
    console.log("Before", action_reactionArray);
    console.log("After", eventArr);

    const elem = findDeletedElement(action_reactionArray, eventArr);
    if (elem !== undefined) {
      console.log("LELEMENT", elem);
      const actReactId = elem.actReactId;
      removeAndUpdateActReaction({ actReactId }, eventArr);
    } else {
      console.error("Changement undefined.");
    }
  }

  /**
   * useEffect hook to fetch action-reaction pairs from the server
   */
  useEffect(() => {
    async function sleep(): Promise<boolean> {
      return new Promise((resolve) => {
        getActionReactionFromServer().then((res) => {
          if (res.statusCode === 200) {
            console.log("New Array", res);
            setaction_reactionArray(res.data.actReacts);
            resolve(false);
          }
        });
      });
    }

    sleep().then((res) => setload(res));
  }, []);

  /**
   * Function to add a point to the loading message
   */
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
          {action_reactionArray.map((item: any, index: number) => {
            if (item.action.type === "APP_LAUNCH") {
              return (
                <BoxEvent
                  className="non-dragable"
                  key={index}
                  keyObj={item}
                  i={index}
                  eventArray={action_reactionArray}
                  seteventArray={updateEventFromBoxEvent}
                />
              );
            }
            return <></>;
          })}
          <AddAppLaunch addNewEvent={addNewEvent} sources={sources} newEvent={newEvent} setnewEvent={setnewEvent} />
          <Link style={{ paddingTop: "20px" }} to="/actions-reactions/actions">
            <Button variant="outlined" startIcon={<BsArrowReturnLeft />} color="info">
              Go Back
            </Button>
          </Link>
        </>
      )}
    </>
  );
};
