import { Box } from "@mui/system";
import React from "react";
import {
  IoIosAddCircleOutline,
} from "react-icons/io";
import CSS from "csstype";
import { WordDetectionModal } from "./WordDetectionModal/WordDetectionModal";
import { SelectChangeEvent } from "@mui/material/Select";
import { toast } from "react-toastify";

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
    console.log(props.newEvent)
    if (props.newEvent.keywords.length !== 0 && props.newEvent.source && props.newEvent.source.name) {
      props.addNewEvent(props.newEvent);
      handleClose();
    } else {
      toast("Please insert at least one keyword and one source.", {
        type: "error"
      });
    }
  };

  const closeWithoutSave = () => {
    props.setnewEvent({ id: props.newEvent, keywords: [], sources: [] });
    handleClose();
  };

  const handleChange = (e: any) => {
    if (e.key === "Enter" && e.currentTarget.value !== "") {
      if (props.newEvent.keywords.length >= 10) {
        e.currentTarget.value = ""
        toast("You cannot have more than 10 keywords.", {
          type: "error"
        });
        return
      }
      
      let cpy = {...props.newEvent};
      
      cpy.keywords.push(e.currentTarget.value);
      e.currentTarget.value = "";
      props.setnewEvent(cpy);
      return
    }
    if (e.currentTarget.value.length >= 20) {
      toast("You cannot have more than 20 characters.", {
        type: "error"
      });
      e.currentTarget.value = (e.currentTarget.value).slice(0, 20);
    }
  };

  const addSource = (event: SelectChangeEvent) => {
    let cpy = {...props.newEvent};
  
    cpy.source = props.sources.find((elem: any) => elem.name === event.target.value)
    props.setnewEvent(cpy);
  };

  const deleteKeyWord = (i: number) => {
    let cpy = {...props.newEvent};

    if (i > -1) {
      cpy.keywords.splice(i, 1);
    }
    props.setnewEvent(cpy);
  }

  return (
    <>
      <Box style={boxStyles} onClick={handleOpen}>
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
