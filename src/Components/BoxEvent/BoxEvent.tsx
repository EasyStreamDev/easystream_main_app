import { Box, Typography } from "@mui/material";
import React from "react";
import { Grid, Item } from "semantic-ui-react";
import CSS from 'csstype';
import { IoIosAddCircleOutline } from "react-icons/io";
import { BsTrash } from "react-icons/bs";

export default function BoxEvent(props: any) {

  const boxStyles: CSS.Properties = {
    border: "solid",
    borderColor: "#FD7014",
    borderWidth: "4",
    paddingLeft: "3vw",
    paddingRight: "3vw",
    paddingTop: "2vh",
    paddingBottom: "2vh",
    backgroundColor: "#222831",
    borderRadius: "15px",
    alignItems: "center",
    cursor: "pointer",
    borderCollapse: "separate",
    borderSpacing: "0 0vh",
    marginBottom: "1vh",
    position: "relative",
    minWidth: "calc(40vw + 231px)",
    maxWidth: "calc(40vw + 231px)",
    lineHeight: 1.6
  };

  const TextStyles: CSS.Properties = {
    alignItems: "center",
    textAlign: "center",
    fontSize: "22px"
  };

  const TextStylesTitle: CSS.Properties = {
    alignItems: "center",
    textAlign: "center",
    fontSize: "24px"
  };


  const IconStyles: CSS.Properties = {
    width: "50px",
    position: "absolute",
    top: "10",
    right: "5",
  };

  const deleteEvent = (i: number) => {
    let cpy = [...props.eventArray];

    if (i > -1) {
      cpy.splice(i, 1);
    }
    for (let j = 0; j < cpy.length; j ++)
      cpy[j].id = j;
    props.seteventArray(cpy);
  }

  return (
    <>
     {
        props.keyObj.action.type === "WORD_DETECT" ?

          <Box style={boxStyles}>
            <span key="if-you-say" style={TextStylesTitle}>If you say : </span>
            {
                props.keyObj.action.params.words.map((item: any, index: number) => {
                  return <span key={item} style={TextStyles}>[{item}] </span>
                })
            }
            <BsTrash
              style={IconStyles}
              onClick={() => { deleteEvent(props.i) }}
            />
            <br></br>
            <span key="the-actions" style={TextStylesTitle}>The reaction : </span>
              <span key={props.keyObj.reactionId } style={TextStyles}>[{props.keyObj.reaction?.name ? props.keyObj.reaction?.name : "NAME ERROR" }]</span>
            <span style={TextStylesTitle}> will be done.</span>
          </Box>

        : (
          props.keyObj.action.type === "KEY_PRESSED" ? 
            
            <Box style={boxStyles}>
              <span key="if-you-type" style={TextStylesTitle}>If you type the letter : </span>
              {
                  props.keyObj.action.params.key
              }
              <BsTrash
                style={IconStyles}
                onClick={() => { deleteEvent(props.i) }}
              />
              <br></br>
              <span key="the-actions" style={TextStylesTitle}>The reaction : </span>
                <span key={props.keyObj.reactionId } style={TextStyles}>[{props.keyObj.reaction?.name ? props.keyObj.reaction?.name : "NAME ERROR" }]</span>
              <span style={TextStylesTitle}> will be done.</span>
            </Box>

          :
            <></>

        )
      }
    </>
  );
}
