import { Box } from "@mui/system";
import React from "react";
import {
  IoIosAddCircleOutline,
} from "react-icons/io";
import CSS from "csstype";
import { MyModal } from "../Modal/Modal";
import { SelectChangeEvent } from "@mui/material/Select";

const boxStyles: CSS.Properties = {
  border: "solid",
  borderColor: "#FD7014",
  borderWidth: "50",
  paddingLeft: "20vw",
  paddingRight: "20vw",
  paddingTop: "2vh",
  paddingBottom: "2vh",
  backgroundColor: "#222831",
  borderRadius: "15px",
  alignItems: "center",
  cursor: "pointer",
};

const IconStyles: CSS.Properties = {
  paddingLeft: "15px",
  fontSize: "30px",
  width: "50px",
};

const TextStyles: CSS.Properties = {
  display: "flex",
  alignItems: "center",
  textAlign: "center",
};

interface event {
  id: number;
  keyword: string[];
  source: String[];
}

export const AddNewWord = (props: any) => {
  const [open, setOpen] = React.useState(false);
  const [sources, setsources] = React.useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const save = () => {
    if (props.newEvent.keywords.length != 0) {
      props.addNewEvent(props.newEvent);
    } else {
      props.setnewEvent({ id: props.newEvent, keywords: [], sources: [] });
    }
    handleClose();
  };

  const closeWithoutSave = () => {
    props.setnewEvent({ id: props.newEvent, keywords: [], sources: [] });
    handleClose();
  };

  const handleChange = (e: any) => {
    if (e.key === "Enter" && e.currentTarget.value != "") {
      if (props.newEvent.keywords.length >= 10) {
        e.currentTarget.value = ""
        alert("You cannot have more than 10 keywords");
        return
      }
      
      let cpy = {...props.newEvent};
      
      cpy.keywords.push(e.currentTarget.value);
      e.currentTarget.value = "";
      props.setnewEvent(cpy);
      return
    }
    if (e.currentTarget.value.length >= 20) {
      alert("You cannot have more than 20 characters");
      e.currentTarget.value = (e.currentTarget.value).slice(0, 20);
    }
  };

  const addSource = (event: SelectChangeEvent) => {
    let cpy = {...props.newEvent};

    if (props.newEvent.sources.indexOf(event.target.value as string) !== -1) {
      alert("This source already exists!");
    } else {
      cpy.sources.push(event.target.value as string);
      setsources(cpy);
    }
  };

  const deleteKeyWord = (i: number) => {
    let cpy = {...props.newEvent};

    if (i > -1) {
      cpy.keywords.splice(i, 1);
    }
    props.setnewEvent(cpy);
  };

  const deleteSource = (i: number) => {
    let cpy = {...props.newEvent};

    if (i > -1) {
      cpy.sources.splice(i, 1);
    }
    props.setnewEvent(cpy);
  };

  return (
    <>
      <Box style={boxStyles} onClick={handleOpen}>
        <h3 style={TextStyles}>
          Click to add new Event
          <i style={IconStyles}>
            <IoIosAddCircleOutline />
          </i>
        </h3>
      </Box>
      <MyModal
        handleOpen={handleOpen}
        handleClose={handleClose}
        save={save}
        closeWithoutSave={closeWithoutSave}
        handleChange={handleChange}
        addSource={addSource}
        deleteKeyWord={deleteKeyWord}
        deleteSource={deleteSource}

        sources={props.sources}
        newEvent={props.newEvent}
        setnewEvent={props.setnewEvent}
        addNewEvent={props.addNewEvent}
        changeEvent={props.changeEvent}
        open={open}
      />
    </>
  );
};
