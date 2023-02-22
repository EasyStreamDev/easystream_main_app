import React, { Component, useEffect, useState } from "react";
import BoxEvent from "../../BoxEvent/BoxEvent";
import { LocalStorage } from '../../../LocalStorage/LocalStorage';
import { getActReactCouplesFormat, actionReactionFormat, removeActReactAnswer } from '../../../Socket/interfaces';
import { AddNewKeyPressed } from "../AddNewKeyPressed/AddNewKeyPressed";
import { Link } from "react-router-dom";
const ipcRenderer = window.require('electron').ipcRenderer

export enum ActionType {
  WORD_DETECT = "WORD_DETECT",
  APP_LAUNCH = "APP_LAUNCH",
  KEY_PRESSED = "KEY_PRESSED",
}

export interface action_reaction_identified {
  actReactId: number,
  isActive: boolean,
  action: {
    actionId: number,
    type: string,
    params?: Object
  },
  reaction: {
    reactionId: number,
    type: string,
    params?: Object
  }
}

export interface action_reaction {
  action: {
    type: string,
    params?: Object
  },
  reaction: {
    name: string,
    type: string,
    params?: Object
  }
}

interface event {
  id: number;
  key: string;
  source: {
    id?: number,
    name?: String,
    action?: ActionType,
    param_value?: number
  };
}

export const KeyPressed = (props: any) => {
  const [ action_reactionArray, setaction_reactionArray ] = React.useState<action_reaction_identified[]>([])
  const [newEvent, setnewEvent] = React.useState<event>({
    id: action_reactionArray.length,
    key: "",
    source: {},
  });
  const [sources] = React.useState(LocalStorage.getItemObject("actionsList") || [])
  const [load, setload] = React.useState(true);
  const [point, setpoint] = React.useState(".");

  const updateActionReactionArray = () => {
    getActionReactionFromServer()
    .then(res => {
      if (res.statusCode === 200) {
        console.log("New Array", res);
        setaction_reactionArray(res.data.actReacts)
      }
    });
  }

  const getActionReactionFromServer = (): Promise<getActReactCouplesFormat> => {
    return new Promise(async (resolve, reject) => {
			const result: getActReactCouplesFormat = await ipcRenderer.sendSync('getActReactCouples', 'ping');
			resolve(result);
		});
  }

  const sendActionReactionToServer = (newActionReaction: action_reaction): Promise<actionReactionFormat> => {
    return new Promise(async (resolve, reject) => {
			const result: actionReactionFormat = await ipcRenderer.sendSync('setActionReaction', newActionReaction);
			resolve(result);
		});
  }

  function addNewEvent(event: any) {
    let newActionReaction: action_reaction = {
      action: {
        type: ActionType.KEY_PRESSED as string,
        params: {
          key: event.key
        }
      },
      reaction: {
        name: event.source.name,
        type: event.source.action,
        params: event.source.params
      }
    }

    console.log(newActionReaction)
    sendActionReactionToServer(newActionReaction)
    .then(res => {
      if (res.statusCode === 200) {
        updateActionReactionArray()
        alert("Action & Reaction submitted successfully !")
      } else {
        alert("Error server")
      }
    });
  }

  function findDeletedElement(originalArray: any[], newArray: any[]): any | undefined {
    const newSet = new Set(newArray);
    for (const element of originalArray) {
      if (!newSet.has(element)) {
        return element;
      }
    }
    return undefined;
  }

  const removeAndUpdateActReaction = (params: any, eventArr: any) => {
    return new Promise(async (resolve, reject) => {
      const result: removeActReactAnswer = await ipcRenderer.sendSync('removeActReact', params)
      if (result.statusCode === 200) {
        console.log("Remove ActReaction", result.data.actReactId)
        updateActionReactionArray()
        alert("Remove Action & Reaction successfully")
      } else {
        alert("Error server. Please check connection.")
      }
    })
  }

  function updateEventFromBoxEvent(eventArr: any) {
    console.log("Before", action_reactionArray);
    console.log("After", eventArr);

    const elem = findDeletedElement(action_reactionArray, eventArr)
    if (elem !== undefined) {
      console.log("LELEMENT", elem)
      const actReactId = elem.actReactId;
      removeAndUpdateActReaction({ actReactId }, eventArr)
    } else {
      console.error("Changement undefined.");
    }
  }

  useEffect(() => {
    async function sleep(): Promise<boolean> {
      return new Promise((resolve) => {
        getActionReactionFromServer()
        .then(res => {
          if (res.statusCode === 200) {
            console.log("New Array", res);
            setaction_reactionArray(res.data.actReacts)
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
      {
        action_reactionArray.map((item: any, index: number) => {
            if (item.action.type === "KEY_PRESSED") {
                return <BoxEvent keyObj={item} key={index} i={index} eventArray={action_reactionArray} seteventArray={updateEventFromBoxEvent}/>;
            }
        })
      }
      <AddNewKeyPressed
        addNewEvent={addNewEvent}
        sources={sources}
        newEvent={newEvent}
        setnewEvent={setnewEvent}
      />
      <Link style={{ "paddingTop": "20px" }} to="/actions-reactions/home">Go Back</Link>
      </>
      )
    }
    </>
  );
};
