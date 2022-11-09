import * as React from "react";
import { AddNewWord } from "../AddNewWord/AddNewWord";
import BoxEvent from "../BoxEvent/BoxEvent";
import { LocalStorage } from '../../LocalStorage/LocalStorage';
import { ActionType } from '../Actions/GeneralActions';

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
  const [ eventArray, seteventArray ] = React.useState(LocalStorage.getItemObject("eventArray") || [])
  const [newEvent, setnewEvent] = React.useState<event>({
    id: eventArray.length,
    keywords: [],
    source: {},
  });
  const [sources] = React.useState(LocalStorage.getItemObject("actionsList") || [])

  function addNewEvent(event: event) {
    let copy = eventArray.slice();
    event.id = eventArray.length;
    copy.push(event);
    seteventArray(copy);
    LocalStorage.setItemObject("eventArray", copy)
    setnewEvent({ id: eventArray.length, keywords: [], source: {} });
  }

  const changeEvent = (id: number, event: event) => {
    let copy = eventArray.slice();
    copy[id] = event;
    seteventArray(copy);
    LocalStorage.setItemObject("eventArray", copy)
  };

  function updateEventFromBoxEvent(eventArr: any) {
    seteventArray(eventArr);
    LocalStorage.setItemObject("eventArray", eventArr)
  }

  return (
    <>
      {eventArray.map((item: any, index: number) => {
        return <BoxEvent keyObj={item} key={index} i={index} eventArray={eventArray} seteventArray={updateEventFromBoxEvent}/>;
      })}
      <AddNewWord
        addNewEvent={addNewEvent}
        changeEvent={changeEvent}
        sources={sources}
        newEvent={newEvent}
        setnewEvent={setnewEvent}
      />
    </>
  );
};
