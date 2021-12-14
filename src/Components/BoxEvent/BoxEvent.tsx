import { Box, Typography } from "@mui/material";
import React from "react";
import { Grid, Item } from "semantic-ui-react";
import CSS from 'csstype';

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
    lineHeight: 1.6
  };

  const TextStyles: CSS.Properties = {
    alignItems: "center",
    textAlign: "center"
  };

  return (
    <>
      <Box style={boxStyles}>
        <span>Keywords : </span>
        {props.keyObj.keywords.map((item: any, index: number) => {
          return <span style={TextStyles}>"{item}" </span>
        })}
        <br></br>
        <span>Sources : </span>
        {props.keyObj.sources.map((item: any, index: number) => {
          return <span style={TextStyles}>"{item}" </span>
        })}
      </Box>
    </>
  );
}
