import * as React from "react";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { borderColor } from "@mui/system";

interface keyword {
  id: number;
  keyword: string;
  scene: String[];
}

export const WordDetection = (props: any) => {
  const [inputText, setInputText] = React.useState<keyword[]>([]);
  const [age, setAge] = React.useState("");
  const [scene] = React.useState([
    "scene 1",
    "scene 2",
    "scene 3",
    "scene 4",
  ]);

  const handleChange = (e: any) => {
    if (e.key === "Enter") {
      console.log(inputText);
      let inputTextcpy = inputText;
      const newElem: keyword = {
        id: inputText.length,
        keyword: e.currentTarget.value,
        scene: [],
      };
      inputTextcpy.push(newElem);
      setInputText(inputTextcpy);
    }
  };

  const handleChangeSelect = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  return (
    <>
      
      <input
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
      </FormControl>
    </>
  );
};
