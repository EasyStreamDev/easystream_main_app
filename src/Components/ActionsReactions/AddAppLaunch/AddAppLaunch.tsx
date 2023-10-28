// Importing necessary modules and components
import "./AddAppLaunch.css";
import { Box } from "@mui/system";
import React from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import CSS from "csstype";
import { AppLaunchModal } from "./AppLaunchModal/AppLaunchModal";
import { SelectChangeEvent } from "@mui/material/Select";
import { toast } from "react-toastify";

// CSS styles for the Box component
const boxStyles: CSS.Properties = {
  border: "solid",
  borderColor: "orange",
  borderWidth: "50",
  paddingLeft: "20vw",
  paddingRight: "20vw",
  paddingTop: "2vh",
  paddingBottom: "2vh",
  backgroundColor: "#565d68",
  borderRadius: "10px",
  alignItems: "center",
  cursor: "pointer",
};

// CSS styles for the icon
const IconStyles: CSS.Properties = {
  paddingLeft: "15px",
  fontSize: "30px",
  width: "50px",
};

// CSS styles for the text
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
 * Component for adding a new App Launch event
 * @param props
 * @returns
 */
export const AddAppLaunch = (props: any) => {
  const [open, setOpen] = React.useState(false); // State for managing modal open/close
  const [sources, setsources] = React.useState(""); // State for managing sources

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
        type: "error",
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
   * Function to handle input change
   * @param e
   * @returns
   */
  const handleChange = (e: any) => {
    if (e.key === "Enter" && e.currentTarget.value !== "") {
      let cpy = { ...props.newEvent };
      cpy.keywords[0] = e.currentTarget.value;
      e.currentTarget.value = "";
      props.setnewEvent(cpy);
      return;
    }
  };

  /**
   * Function to add a source
   * @param event
   */
  const addSource = (event: SelectChangeEvent) => {
    let cpy = { ...props.newEvent };
    cpy.source = props.sources.find((elem: any) => elem.name === event.target.value);
    props.setnewEvent(cpy);
  };

  return (
    <>
      {/* Box component for adding new event */}
      <Box className="non-dragable" style={boxStyles} onClick={handleOpen}>
        <h3 style={TextStyles}>
          Click to add new App Launch Event
          <i style={IconStyles}>
            <IoIosAddCircleOutline />
          </i>
        </h3>
      </Box>

      {/* Modal component for adding a new event */}
      <AppLaunchModal
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
