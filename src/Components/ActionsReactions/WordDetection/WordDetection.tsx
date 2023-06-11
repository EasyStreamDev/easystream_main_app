import React, { Component, useEffect, useState } from "react";
import { AddNewWord } from "../AddNewWord/AddNewWord";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { BsArrowReturnLeft } from "react-icons/bs"
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

import BoxEvent from "../../BoxEvent/BoxEvent";
import { LocalStorage } from "../../../LocalStorage/LocalStorage";
import {
  getActReactCouplesFormat,
  actionReactionFormat,
  removeActReactAnswer,
} from "../../../Socket/interfaces";
import { toast } from "react-toastify";
import { ActionType, action_reaction_identified } from "../ActionsReactions";
const ipcRenderer = window.require("electron").ipcRenderer;

export interface action_reaction {
  action: {
    type: string; // Type of action
    params?: Object; // Optional parameters for the action
  };
  reaction: {
    name: string; // Name of the reaction
    type: string; // Type of reaction
    params?: Object; // Optional parameters for the reaction
  };
}

interface event {
  id: number; // Unique identifier for an event
  keywords: String[]; // Array of keywords associated with the event
  source: {
    id?: number; // Unique identifier for the event source
    name?: String; // Name of the event source
    action?: ActionType; // Type of action associated with the event
    param_value?: number; // Parameter value for the event source
  };
}

export const WordDetection = (props: any) => {
  const [action_reactionArray, setaction_reactionArray] = React.useState<
    action_reaction_identified[]
  >([]); // State for storing action-reaction pairs
  const [newEvent, setnewEvent] = React.useState<event>({
    id: action_reactionArray.length, // Set the ID of the new event based on the length of the action-reaction array
    keywords: [],
    source: {},
  });
  const [sources] = React.useState(
    LocalStorage.getItemObject("actionsList") || []
  ); // State for storing sources
  const [load, setload] = React.useState(true); // Flag indicating whether the component is loading or not
  const [point, setpoint] = React.useState("."); // State for displaying a point

  const axiosPrivate = useAxiosPrivate(); // Custom hook for using private Axios instance

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

  const updateActionReactionArray = () => {
    getActionReactionFromServer().then((res) => {
      if (res.statusCode === 200) {
        console.log("New Array", res);
        setaction_reactionArray(res.data.actReacts); // Update the action-reaction array with the response from the server
      }
    });
  };

  const getActionReactionFromServer = (): Promise<getActReactCouplesFormat> => {
    return new Promise(async (resolve, reject) => {
      const result: getActReactCouplesFormat = await ipcRenderer.sendSync(
        "getActReactCouples",
        "ping"
      ); // Send a synchronous IPC message to get action-reaction couples from the server
      resolve(result);
    });
  };

  const sendActionReactionToServer = (
    newActionReaction: action_reaction
  ): Promise<actionReactionFormat> => {
    return new Promise(async (resolve, reject) => {
      const result: actionReactionFormat = await ipcRenderer.sendSync(
        "setActionReaction",
        newActionReaction
      ); // Send a synchronous IPC message to set a new action-reaction pair on the server
      resolve(result);
    });
  };

  function addNewEvent(event: any) {
    let newActionReaction: action_reaction = {
      action: {
        type: ActionType.WORD_DETECT as string, // Set the type of action as WORD_DETECT
        params: {
          words: event.keywords, // Set the words parameter for the action as the event's keywords
        },
      },
      reaction: {
        name: event.source.name, // Set the name of the reaction as the event source's name
        type: event.source.action, // Set the type of reaction as the event source's action type
        params: event.source.params, // Set the parameters for the reaction as the event source's parameters
      },
    };

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

  function findDeletedElement(
    originalArray: any[],
    newArray: any[]
  ): any | undefined {
    const newSet = new Set(newArray);
    for (const element of originalArray) {
      if (!newSet.has(element)) {
        return element; // Return the deleted element from the original array
      }
    }
    return undefined; // Return undefined if no deleted element is found
  }

  const removeAndUpdateActReaction = (params: any, eventArr: any) => {
    return new Promise(async (resolve, reject) => {
      const result: removeActReactAnswer = await ipcRenderer.sendSync(
        "removeActReact",
        params
      ); // Send a synchronous IPC message to remove the action-reaction pair from the server
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

  function updateEventFromBoxEvent(eventArr: any) {
    console.log("Before", action_reactionArray); // Log the action-reaction array before the update
    console.log("After", eventArr); // Log the updated action-reaction array

    const elem = findDeletedElement(action_reactionArray, eventArr);
    if (elem !== undefined) {
      console.log("LELEMENT", elem);
      const actReactId = elem.actReactId;
      removeAndUpdateActReaction({ actReactId }, eventArr); // Remove the deleted element and update the action-reaction array
    } else {
      console.error("Changement undefined."); // Log an error if the changed element is undefined
    }
  }

  useEffect(() => {
    async function sleep(): Promise<boolean> {
      return new Promise((resolve) => {
        getActionReactionFromServer().then((res) => {
          if (res.statusCode === 200) {
            console.log("New Array", res);
            setaction_reactionArray(res.data.actReacts); // Update the action-reaction array with the response from the server
            resolve(false);
          }
        });
      });
    }

    sleep().then((res) => setload(res)); // Set the load state to false after the action-reaction array is updated
  }, []);

  function addpoint() {
    {
      setInterval(() => {
        point.length >= 3 ? setpoint(".") : setpoint(point + "."); // Add a point to the point state every second
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
            if (item.action.type === "WORD_DETECT") {
              return (
                <BoxEvent
                  key={index}
                  keyObj={item}
                  i={index}
                  eventArray={action_reactionArray}
                  seteventArray={updateEventFromBoxEvent}
                />
              );
            }
          })}
          <AddNewWord
            addNewEvent={addNewEvent}
            sources={sources}
            newEvent={newEvent}
            setnewEvent={setnewEvent}
          />
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
