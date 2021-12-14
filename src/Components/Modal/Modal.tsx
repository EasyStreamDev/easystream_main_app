import './Modal.css'
import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { BsTrash } from "react-icons/bs";
import { FormControl, InputLabel, MenuItem, Select, withStyles } from "@mui/material";
import { AiOutlineMinus } from "react-icons/ai";
import CSS from "csstype";

const style = {
  Box: {
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
  },
  Icon: {
    paddingLeft: "85%",
    fontSize: "15px",
    width: "50px",
  },
  Text: {
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    wordWrap: "break-word",
    width: "10px",
    maxWidth: "10px",
    whiteSpace: "nowrap",
    paddingLeft: "1vw",
  },
};

export const MyModal = (props: any) => {
  return (
    <Modal
      open={props.open}
      onClose={() => props.closeWithoutSave()}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style.Box}>
        <input
          style={{
            color: "white",
            backgroundColor: "#393E46",
            outline: "none",
            borderStyle: "Hidden",
            borderRadius: "20px",
            paddingTop: "1vh",
            paddingBottom: "1vh",
            paddingLeft: "1vw",
            marginBottom: "2vh",
            width: "100%",
          }}
          placeholder="type a key word.."
          name="input-box"
          type="text"
          onKeyUp={(event) => {
            props.handleChange(event);
          }}
        />
        {props.newEvent.keywords.map((item: string, index: number) => {
          return (
            <Box
              className="typography-item"
              sx={{ color: "white", columns: 2, cursor: "pointer" }}
              onClick={() => {
                props.deleteKeyWord(index);
              }}
            >
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                key={index}
                sx={{
                  color: "white",
                  mb: "3vh",
                  maxWidth: "10px",
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
                  wordWrap: "break-word",
                  width: "10px",
                  whiteSpace: "nowrap",
                  paddingLeft: "1vw",
                }}
              >
                {item}
              </Typography>
              <i style={style.Icon}>
                <BsTrash />
              </i>
            </Box>
          );
        })}

        <FormControl fullWidth sx={{ pb: "1vh", borderColor: "white" }}>
          <InputLabel id="demo-simple-select-label" sx={{ color: "white" }}>
            sources
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={props.sources}
            label="sources"
            onChange={props.addSource}
            className="select-sources"
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
            <Box
              className="typography-item"
              sx={{ color: "white", columns: 2, cursor: "pointer" }}
              onClick={() => {
                props.deleteSource(index);
              }}
            >
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                key={index}
                sx={{
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
                  wordWrap: "break-word",
                  width: "10px",
                  maxWidth: "10px",
                  whiteSpace: "nowrap",
                  mb: "3vh",
                  paddingLeft: "1vw",
                }}
                // style={style.Text}
              >
                {item}
              </Typography>
              <i style={style.Icon}>
                <BsTrash />
              </i>
            </Box>
          );
        })}
        <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
          <Button
            onClick={() => props.save()}
            sx={{ color: "#FD7014", flex: "1", mt: "2vh" }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
