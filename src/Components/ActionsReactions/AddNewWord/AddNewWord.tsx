import { Box } from "@mui/system";
import React from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import CSS from "csstype";
import { WordDetectionModal } from "./WordDetectionModal/WordDetectionModal";
import { SelectChangeEvent } from "@mui/material/Select";
import { toast } from "react-toastify";
import "./AddNewWord.css";

/**
 * CSS styles for the box component
 */
const boxStyles: CSS.Properties = {
  border: "solid",
  borderColor: "orange",
  borderWidth: "50",
  paddingLeft: "20vw",
  paddingRight: "20vw",
  paddingTop: "2vh",
  paddingBottom: "2vh",
  backgroundColor: "#222831",
  borderRadius: "10px",
  alignItems: "center",
  cursor: "pointer",
};

/**
 * CSS styles for the icon component
 */
const IconStyles: CSS.Properties = {
  paddingLeft: "15px",
  fontSize: "30px",
  width: "50px",
};

/**
 * CSS styles for the text component
 */
const TextStyles: CSS.Properties = {
  display: "flex",
  alignItems: "center",
  textAlign: "center",
};

/**
 * Interface for the event object
 */
interface event {
  id: number;
  keyword: string[];
  source: String[];
}

/**
 * Component that adds a new keyword event
 * @param props
 * @returns
 */
export const AddNewWord = (props: any) => {
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
    console.log(props.newEvent);
    if (props.newEvent.keywords.length !== 0 && props.newEvent.source && props.newEvent.source.name) {
      props.addNewEvent(props.newEvent);
      handleClose();
    } else {
      toast("Please insert at least one keyword and one source.", {
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
   * Function to handle the change event of the words input
   * @param e
   */
  const handleChange = (e: any) => {
    if (e.key === "Enter" && e.currentTarget.value !== "") {
      if (props.newEvent.keywords.length >= 10) {
        e.currentTarget.value = "";
        toast("You cannot have more than 10 keywords.", {
          type: "error",
        });
        return;
      }

      let cpy = { ...props.newEvent };

      cpy.keywords.push(e.currentTarget.value);
      e.currentTarget.value = "";
      props.setnewEvent(cpy);
      return;
    }
    if (e.currentTarget.value.length >= 20) {
      toast("You cannot have more than 20 characters.", {
        type: "error",
      });
      e.currentTarget.value = e.currentTarget.value.slice(0, 20);
    }
  };

  /**
   * Function to add a source to the new event
   * @param event
   */
  const addSource = (event: SelectChangeEvent) => {
    let cpy = { ...props.newEvent };

    cpy.source = props.sources.find((elem: any) => elem.name === event.target.value);
    props.setnewEvent(cpy);
  };

  /**
   * Function to delete a word
   * @param event
   */
  const deleteKeyWord = (i: number) => {
    let cpy = { ...props.newEvent };

    if (i > -1) {
      cpy.keywords.splice(i, 1);
    }
    props.setnewEvent(cpy);
  };

  return (
    <>
      <Box className="non-dragable" style={boxStyles} onClick={handleOpen}>
        <h3 style={TextStyles}>
          Click to add new Word Detection Event
          <i style={IconStyles}>
            <IoIosAddCircleOutline />
          </i>
        </h3>
      </Box>
      <WordDetectionModal
        handleOpen={handleOpen}
        handleClose={handleClose}
        save={save}
        closeWithoutSave={closeWithoutSave}
        handleChange={handleChange}
        addSource={addSource}
        deleteKeyWord={deleteKeyWord}
        sources={props.sources}
        newEvent={props.newEvent}
        setnewEvent={props.setnewEvent}
        addNewEvent={props.addNewEvent}
        open={open}
      />
    </>
  );
};
