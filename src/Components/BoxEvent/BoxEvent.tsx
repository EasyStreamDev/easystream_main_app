import { Box, Typography } from "@mui/material";
import React from "react";
import { Grid, Item } from "semantic-ui-react";
import CSS from 'csstype';

export default function BoxEvent(props: any) {

  const gridStyles: CSS.Properties = {
    border: "solid",
    borderColor: "#FD7014",
    borderWidth: "4",
    paddingLeft: "1vw",
    paddingRight: "1vw",
    paddingTop: "2vh",
    paddingBottom: "2vh",
    backgroundColor: "#222831",
    borderRadius: "15px",
    alignItems: "center",
    cursor: "pointer",
    borderCollapse: "separate",
    borderSpacing: "0 10vh",
    marginBottom: "1vh",
    lineHeight: 1.6
  };

  const TextStyles: CSS.Properties = {
    display: "flex",
    alignItems: "center",
    textAlign: "center"
  };

  return (
    <>
      <Box style={gridStyles}>
        <Grid container>
          {/* <Item styles={TextStyles}>Obj ID : {props.keyObj.id}</Item> */}
          {/* <Item styles={TextStyles}>Keywords : </Item> */}
          {props.keyObj.keywords.map((item: any, index: number) => {
            return <Item styles={TextStyles}>{index} : {item}</Item>
          })}
          {/* <Item styles={TextStyles}>Sources : </Item> */}
          {props.keyObj.sources.map((item: any, index: number) => {
            return <Item styles={TextStyles}>{index} : {item}</Item>
          })}
        </Grid>
      </Box>
      {/* <Box>
        <h1></h1>
      </Box> */}
    </>
  );
}
