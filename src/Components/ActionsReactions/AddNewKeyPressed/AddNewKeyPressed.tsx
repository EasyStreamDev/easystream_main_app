import { Box } from "@mui/system";
import React from "react";
import {
  IoIosAddCircleOutline,
} from "react-icons/io";
import CSS from "csstype";
import { KeyPressedModal } from "./KeyPressedModal/KeyPressedModal"
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

export const AddNewKeyPressed = (props: any) => {
  const [open, setOpen] = React.useState(false);
  const [sources, setsources] = React.useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const save = () => {
    if (props.newEvent.length !== 0 && props.newEvent.source && props.newEvent.source.name) {
      props.addNewEvent(props.newEvent);
      handleClose();
    } else {
      alert("Please insert at least one keyword and one source.")
    }
  };

  const closeWithoutSave = () => {
    props.setnewEvent({ id: props.newEvent, keywords: [], sources: [] });
    handleClose();
  };

  const handleChange = (e: any) => {
    props.newEvent.key = e
  };

  const addSource = (event: SelectChangeEvent) => {
    let cpy = {...props.newEvent};
  
    cpy.source = props.sources.find((elem: any) => elem.name === event.target.value)
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
      <KeyPressedModal
        handleOpen={handleOpen}
        handleClose={handleClose}
        save={save}
        closeWithoutSave={closeWithoutSave}
        handleChange={handleChange}
        addSource={addSource}

        sources={props.sources}
        newEvent={props.newEvent}
        setnewEvent={props.setnewEvent}
        addNewEvent={props.addNewEvent}
        open={open}
      />
    </>
  );
};
