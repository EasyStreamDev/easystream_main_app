import { Box } from "@mui/system";
import React from "react";
import {
  IoIosAddCircleOutline,
  IoMdAdd,
  IoMdAddCircleOutline,
} from "react-icons/io";
import CSS from "csstype";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import BasicModal from "../Modal/Modal";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { borderColor } from "@mui/system";
import { AiOutlineMinus } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";

const boxStyles: CSS.Properties = {
  border: "solid",
  borderColor: "#FD7014",
  borderWidth: "4",
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

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#222831",
  border: "2px solid #FD7014",
  boxShadow: 24,
  p: 4,
  borderRadius: "15px",
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
      props.setnewEvent({id: props.newEvent, keywords: [], sources: []});
    }
    handleClose();
  };

  const closeWithoutSave = () => {
    props.setnewEvent({id: props.newEvent, keywords: [], sources: []});
    handleClose();
  }

  const handleChange = (e: any) => {
    if (e.key === "Enter" && e.currentTarget.value != "") {
      let cpy = Object.assign({}, props.newEvent);

      cpy.keywords.push(e.currentTarget.value);
      e.currentTarget.value = "";
      props.setnewEvent(cpy);
    }
  };

  const addSource = (event: SelectChangeEvent) => {
    let cpy = Object.assign({}, props.newEvent);

    if(props.newEvent.sources.indexOf(event.target.value as string) !== -1){
      alert("Value already exists!")
    } else{
      cpy.sources.push(event.target.value as string);
      setsources(cpy);
    }
  };

  const deleteKeyWord = (i: number) => {
    let cpy = Object.assign({}, props.newEvent);

    if (i > -1) {
      cpy.keywords.splice(i, 1);
    }
    props.setnewEvent(cpy);
  };

  const deleteSource = (i: number) => {
    let cpy = Object.assign({}, props.newEvent);

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

      <Modal
        open={open}
        onClose={() => closeWithoutSave()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <input
            placeholder="type a key word.."
            name="input-box"
            type="text"
            onKeyUp={(event) => {
              handleChange(event);
            }}
          />
          {props.newEvent.keywords.map((item: string, index: number) => {
            return (
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                key={index}
                sx={{ color: "white", cursor: "pointer" }}
                onClick={() => {
                  deleteKeyWord(index);
                }}
              >
                {item}
                <BsTrash />
              </Typography>
            );
          })}

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">sources</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={props.sources}
              label="sources"
              onChange={addSource}
            >
              {props.sources.map((source: string, index: number) => (
                <MenuItem value={source} key={index}>
                  {source}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {props.newEvent.sources.map((item: string, index: number) => {
            return (
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                key={index}
                onClick={() => {deleteSource(index)}}
                sx={{ color: "white", cursor: "pointer" }}
              >
                {item}
                <AiOutlineMinus />
              </Typography>
            );
          })}
          <Button onClick={() => save()}>Save</Button>
        </Box>
      </Modal>
    </>
  );
};
