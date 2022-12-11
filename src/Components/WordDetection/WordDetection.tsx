import React, { Component, useEffect, useState } from "react";
import { AddNewWord } from "../AddNewWord/AddNewWord";
import BoxEvent from "../BoxEvent/BoxEvent";
import { LocalStorage } from '../../LocalStorage/LocalStorage';
import { getActReactCouplesFormat, actionReactionFormat } from '../../Socket/interfaces';
const ipcRenderer = window.require('electron').ipcRenderer

export enum ActionType {
  WORD_DETECT = "WORD_DETECT",
  APP_LAUNCH = "APP_LAUNCH",
  KEY_PRESSED = "KEY_PRESSED",
}

interface action_reaction_identified {
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

interface action_reaction {
  action: {
    type: string,
    params?: Object
  },
  reaction: {
    type: string,
    params?: Object
  }
}

interface event {
  id: number;
  keywords: String[];
  source: {
    id?: number,
    name?: String,
    action?: ActionType,
    param_value?: number
  };
}

export const WordDetection = (props: any) => {
  const [ action_reactionArray, setaction_reactionArray ] = React.useState<action_reaction_identified[]>([])
  const [newEvent, setnewEvent] = React.useState<event>({
    id: action_reactionArray.length,
    keywords: [],
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
        setaction_reactionArray(res.actReacts)
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
        type: ActionType.WORD_DETECT as string,
        params: {
          words: event.keywords
        }
      },
      reaction: {
        type: event.source.action,
        params: event.source.params
      }
    }

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

  function updateEventFromBoxEvent(eventArr: any) {
    setaction_reactionArray(eventArr);
    LocalStorage.setItemObject("action_reactionArray", eventArr)
  }

  useEffect(() => {
    async function sleep(): Promise<boolean> {
      return new Promise((resolve) => {
        getActionReactionFromServer()
        .then(res => {
          if (res.statusCode === 200) {
            console.log("New Array", res);
            setaction_reactionArray(res.actReacts)
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
          return <BoxEvent keyObj={item} key={index} i={index} eventArray={action_reactionArray} seteventArray={updateEventFromBoxEvent}/>;
        })
      }
      <AddNewWord
        addNewEvent={addNewEvent}
        sources={sources}
        newEvent={newEvent}
        setnewEvent={setnewEvent}
      />
      </>
      )
    }
    </>
  );
};
