import { Box } from "@mui/system";
import React from "react";
import { IoIosAddCircleOutline, IoMdAdd, IoMdAddCircleOutline } from "react-icons/io";
import CSS from 'csstype';


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
  cursor: "pointer"
};

const IconStyles: CSS.Properties = {
  paddingLeft: "15px",
  fontSize: "30px",
  width: "50px"
};

const TextStyles: CSS.Properties = {
  display: "flex",
  alignItems: "center",
  textAlign: "center"
};

export const AddNewWord = (props: any) => {
  return (
    <>
      <Box style={boxStyles} onClick={() => {props.createNewEvent()}}>
        <h3 style={TextStyles}>Click to add new Event
          <i style={IconStyles}>
            <IoIosAddCircleOutline />
          </i>
        </h3>
      </Box>
    </>
  );
};
