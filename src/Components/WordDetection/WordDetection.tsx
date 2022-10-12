import * as React from "react";
import { AddNewWord } from "../AddNewWord/AddNewWord";
import BoxEvent from "../BoxEvent/BoxEvent";

interface event {
  id: number;
  keywords: string[];
  sources: String[];
}

export const WordDetection = (props: any) => {
  const [eventArray, seteventArray] = React.useState<event[]>([]);
  const [newEvent, setnewEvent] = React.useState<event>({
    id: eventArray.length,
    keywords: [],
    sources: [],
  });
  const [sources] = React.useState([
    "cameras on",
    "cameras off",
    "camera shot change",
    "shop display",
    "Facebook pop-up display",
    "Instagram pop-up display",
    "Twitter pop-up display",
    "donate pop-up display",
    "subscribe pop-up display",
  ]);

  function addNewEvent(event: event) {
    let copy = eventArray.slice();
    event.id = eventArray.length;
    copy.push(event);
    seteventArray(copy);
    setnewEvent({ id: eventArray.length, keywords: [], sources: [] });
  }

  const changeEvent = (id: number, event: event) => {
    let copy = eventArray.slice();
    copy[id] = event;
    seteventArray(copy);
  };

  return (
    <>
      {eventArray.map((item, index) => {
        return <BoxEvent keyObj={item} key={index} i={index} eventArray={eventArray} seteventArray={seteventArray}/>;
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
