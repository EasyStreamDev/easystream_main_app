import { Box } from "@mui/system";
import React from "react";
import {
  IoIosAddCircleOutline,
} from "react-icons/io";
import CSS from "csstype";
import { KeyPressedModal } from "./KeyPressedModal/KeyPressedModal"
import { SelectChangeEvent } from "@mui/material/Select";
import { toast } from "react-toastify";

// CSS styles for the box component
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

// CSS styles for the icon component
const IconStyles: CSS.Properties = {
  paddingLeft: "15px",
  fontSize: "30px",
  width: "50px",
};

// CSS styles for the text component
const TextStyles: CSS.Properties = {
  display: "flex",
  alignItems: "center",
  textAlign: "center",
};

// Interface for the event object
interface event {
  id: number;
  keyword: string[];
  source: String[];
}

/**
 * Component that adds a new key pressed event
 * @param props 
 * @returns 
 */
export const AddNewKeyPressed = (props: any) => {
  const [open, setOpen] = React.useState(false);
  const [sources, setsources] = React.useState("");
  
  /**
   * Function to handle opening the modal
   * @returns 
   */
  const handleOpen = () => setOpen(true);
  
  /**
   * Function to handle closing the modal
   * @returns 
   */
  const handleClose = () => setOpen(false);

  /**
   * Function to save the new event
   */
  const save = () => {
    if (props.newEvent.length !== 0 && props.newEvent.source && props.newEvent.source.name) {
      props.addNewEvent(props.newEvent);
      handleClose();
    } else {
      toast("Please insert at least one source.", {
        type: "error"
      });
    }
  };

  /**
   * Function to close the modal without saving
   */
  const closeWithoutSave = () => {
    props.setnewEvent({ id: props.newEvent, keywords: [], sources: [] });
    handleClose();
  };

  /**
   * Function to handle the change event of the key input
   * @param e 
   */
  const handleChange = (e: any) => {
    props.newEvent.key = e
  };

  /**
   * Function to add a source to the new event
   * @param event 
   */
  const addSource = (event: SelectChangeEvent) => {
    let cpy = {...props.newEvent};
  
    cpy.source = props.sources.find((elem: any) => elem.name === event.target.value)
    props.setnewEvent(cpy);
  };

  return (
    <>
      <Box style={boxStyles} onClick={handleOpen}>
        <h3 style={TextStyles}>
          Click to add new Key Pressed Event
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
