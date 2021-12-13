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
  keyword: string[];
  source: String[];
}

export const WordDetection = (props: any) => {
  const [eventArray, seteventArray] = React.useState<event[]>([{ id: 0, keyword: ["bonjour", "salut", "coucou", "alloah", "hola", "hello"], source: ["ecran d'accueil", "jeu"] }, { id: 1, keyword: ["boutique", "shopping"], source: ["boutique"] }]);
  const [age, setAge] = React.useState("");
  const [scene] = React.useState([
    "scene 1",
    "scene 2",
    "scene 3",
    "scene 4",
  ]);

  // const handleChange = (e: any) => {
  //   if (e.key === "Enter") {
  //     console.log(inputText);
  //     let inputTextcpy = inputText;
  //     const newElem: keyword = {
  //       id: inputText.length,
  //       keyword: e.currentTarget.value,
  //       scene: [],
  //     };
  //     inputTextcpy.push(newElem);
  //     setInputText(inputTextcpy);
  //   }
  // };

  // const handleChangeSelect = (event: SelectChangeEvent) => {
  //   setAge(event.target.value as string);
  // };

  function addNewEvent() {
    console.log("parent");
    let copy = eventArray.slice();
    const newEvent = { id: eventArray.length, keyword: [], source: [] };
    copy.push(newEvent);
    seteventArray(copy);
    console.log(eventArray);
  }
  // const handleChange = (e: any) => {
  //   if (e.key === "Enter") {
  //     console.log(inputText);
  //     let inputTextcpy = inputText;
  //     const newElem: keyword = {
  //       id: inputText.length,
  //       keyword: e.currentTarget.value,
  //       scene: [],
  //     };
  //     inputTextcpy.push(newElem);
  //     setInputText(inputTextcpy);
  //   }
  // };

  // const handleChangeSelect = (event: SelectChangeEvent) => {
  //   setAge(event.target.value as string);
  // };

  return (
    <>
      {eventArray.map((item, index) => {
        return <BoxEvent keyObj={item}
        />
      })}
      <AddNewWord createNewEvent={() => addNewEvent()} />
      {/* <input
        placeholder="type a key word.."
        name="input-box"
        type="text"
        onKeyUp={(event) => {
          handleChange(event);
        }}
      />
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Scene</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Scene"
          onChange={handleChangeSelect}
        >
          {scene.map((scene => <MenuItem value={scene}>{scene}</MenuItem>))}
        </Select>
      </FormControl> */}
    </>
  );
};