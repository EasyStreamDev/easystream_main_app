import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { borderColor } from "@mui/system";
import { AddNewWord } from "../AddNewWord/AddNewWord";
import BoxEvent from "../BoxEvent/BoxEvent";
// import { AddNewWord } from "../AddNewWord/AddNewWord";
// import { BoxEvent } from "../BoxEvent/BoxEvent";

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
    "sources 1",
    "sources 2",
    "sources 3",
    "sources 4",
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
