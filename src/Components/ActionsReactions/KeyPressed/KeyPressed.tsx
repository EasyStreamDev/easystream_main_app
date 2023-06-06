import React, { Component, useEffect, useState } from "react";
import BoxEvent from "../../BoxEvent/BoxEvent";
import { LocalStorage } from "../../../LocalStorage/LocalStorage";
import {
  getActReactCouplesFormat,
  actionReactionFormat,
  removeActReactAnswer,
} from "../../../Socket/interfaces";
import { AddNewKeyPressed } from "../AddNewKeyPressed/AddNewKeyPressed";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
const ipcRenderer = window.require("electron").ipcRenderer;

export enum ActionType {
  WORD_DETECT = "WORD_DETECT", // Enum for different action types
  APP_LAUNCH = "APP_LAUNCH",
  KEY_PRESSED = "KEY_PRESSED",
}

export interface action_reaction_identified {
  actReactId: number; // Identifier for action-reaction pair
  isActive: boolean; // Indicates whether the action-reaction pair is active
  action: {
    actionId: number; // Identifier for the action
    type: string; // Type of the action
    params?: Object; // Additional parameters for the action
  };
  reaction: {
    reactionId: number; // Identifier for the reaction
    type: string; // Type of the reaction
    params?: Object; // Additional parameters for the reaction
  };
}

export interface action_reaction {
  action: {
    type: string; // Type of the action
    params?: Object; // Additional parameters for the action
  };
  reaction: {
    name: string; // Name of the reaction
    type: string; // Type of the reaction
    params?: Object; // Additional parameters for the reaction
  };
}

interface event {
  id: number; // Identifier for the event
  key: string; // Key associated with the event
  source: {
    id?: number; // Identifier for the event source
    name?: String; // Name of the event source
    action?: ActionType; // Type of the action associated with the event
    param_value?: number; // Parameter value for the event
  };
}

export const KeyPressed = (props: any) => {
  const [action_reactionArray, setaction_reactionArray] = React.useState<
    action_reaction_identified[]
  >([]); // State variable to store action-reaction pairs
  const [newEvent, setnewEvent] = React.useState<event>({
    id: action_reactionArray.length,
    key: "",
    source: {},
  });
  const [sources] = React.useState(
    LocalStorage.getItemObject("actionsList") || []
  ); // State variable to store sources
  const [load, setload] = React.useState(true); // State variable to indicate if the component is loading
  const [point, setpoint] = React.useState("."); // State variable to store a point

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
      ); // Send a synchronous request to the server to get action-reaction pairs
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
      ); // Send a synchronous request to the server to set an action-reaction pair
      resolve(result);
    });
  };

  function addNewEvent(event: any) {
    let newActionReaction: action_reaction = {
      action: {
        type: ActionType.KEY_PRESSED as string, // Set the action type as KEY_PRESSED
        params: {
          key: event.key, // Set the key parameter for the action
        },
      },
      reaction: {
        name: event.source.name, // Set the name parameter for the reaction
        type: event.source.action, // Set the type parameter for the reaction
        params: event.source.params, // Set the params parameter for the reaction
      },
    };

    console.log(newActionReaction);
    sendActionReactionToServer(newActionReaction).then((res) => {
      if (res.statusCode === 200) {
        updateActionReactionArray(); // Update the action-reaction array after adding a new action-reaction pair
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
        return element; // Find the element that has been deleted from the original array
      }
    }
    return undefined;
  }

  const removeAndUpdateActReaction = (params: any, eventArr: any) => {
    return new Promise(async (resolve, reject) => {
      const result: removeActReactAnswer = await ipcRenderer.sendSync(
        "removeActReact",
        params
      ); // Send a synchronous request to the server to remove an action-reaction pair
      if (result.statusCode === 200) {
        console.log("Remove ActReaction", result.data.actReactId);
        updateActionReactionArray(); // Update the action-reaction array after removing an action-reaction pair
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
    console.log("Before", action_reactionArray);
    console.log("After", eventArr);

    const elem = findDeletedElement(action_reactionArray, eventArr);
    if (elem !== undefined) {
      console.log("LELEMENT", elem);
      const actReactId = elem.actReactId;
      removeAndUpdateActReaction({ actReactId }, eventArr); // Remove the deleted action-reaction pair from the server
    } else {
      console.error("Changement undefined.");
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

    sleep().then((res) => setload(res)); // Set the loading state variable to false after fetching the action-reaction pairs
  }, []);

  function addpoint() {
    {
      setInterval(() => {
        point.length >= 3 ? setpoint(".") : setpoint(point + "."); // Add a point to the point state variable after every second
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
            if (item.action.type === "KEY_PRESSED") {
              return (
                <BoxEvent
                  keyObj={item}
                  key={index}
                  i={index}
                  eventArray={action_reactionArray}
                  seteventArray={updateEventFromBoxEvent}
                />
              );
            }
          })}
          <AddNewKeyPressed
            addNewEvent={addNewEvent}
            sources={sources}
            newEvent={newEvent}
            setnewEvent={setnewEvent}
          />
          <Link style={{ paddingTop: "20px" }} to="/actions-reactions/home">
            Go Back
          </Link>
        </>
      )}
    </>
  );
};
