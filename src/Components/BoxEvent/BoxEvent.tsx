import { Box } from "@mui/material";
import CSS from "csstype";
import { BsTrash } from "react-icons/bs";
import "./BoxEvent.css";

export default function BoxEvent(props: any) {
  const boxStyles: CSS.Properties = {
    border: "solid",
    borderColor: "orange",
    borderWidth: "4",
    paddingLeft: "3vw",
    paddingRight: "3vw",
    paddingTop: "2vh",
    paddingBottom: "2vh",
    backgroundColor: "#222831",
    borderRadius: "10px",
    alignItems: "center",
    cursor: "pointer",
    borderCollapse: "separate",
    borderSpacing: "0 0vh",
    marginBottom: "1vh",
    position: "relative",
    minWidth: "calc(40vw + 231px)",
    maxWidth: "calc(40vw + 231px)",
    lineHeight: 1.6,
  };

  const TextStyles: CSS.Properties = {
    alignItems: "center",
    textAlign: "center",
    fontSize: "22px",
  };

  const TextStylesTitle: CSS.Properties = {
    alignItems: "center",
    textAlign: "center",
    fontSize: "24px",
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
    for (let j = 0; j < cpy.length; j++) cpy[j].id = j;
    props.seteventArray(cpy);
  };

  return (
    <>
      {props.keyObj.action.type === "WORD_DETECT" ? (
        <Box className="non-dragable" style={boxStyles}>
          <span key="if-you-say" style={TextStylesTitle}>
            If you say :{" "}
          </span>
          {props.keyObj.action.params.words.map((item: any, index: number) => {
            return (
              <span key={item} style={TextStyles}>
                [{item}]{" "}
              </span>
            );
          })}
          <BsTrash
            style={IconStyles}
            color="white"
            onClick={() => {
              deleteEvent(props.i);
            }}
          />
          <br></br>
          <span key="the-actions" style={TextStylesTitle}>
            The reaction :{" "}
          </span>
          <span key={props.keyObj.reactionId} style={TextStyles}>
            [{props.keyObj.reaction?.name ? props.keyObj.reaction?.name : "NAME ERROR"}]
          </span>
          <span style={TextStylesTitle}> will be done.</span>
        </Box>
      ) : props.keyObj.action.type === "KEY_PRESSED" ? (
        <Box className="non-dragable" style={boxStyles}>
          <span key="if-you-type" style={TextStylesTitle}>
            If you type the letter :{" "}
          </span>
          {props.keyObj.action.params.key}
          <BsTrash
            color="white"
            style={IconStyles}
            onClick={() => {
              deleteEvent(props.i);
            }}
          />
          <br></br>
          <span key="the-actions" style={TextStylesTitle}>
            The reaction :{" "}
          </span>
          <span key={props.keyObj.reactionId} style={TextStyles}>
            [{props.keyObj.reaction?.name ? props.keyObj.reaction?.name : "NAME ERROR"}]
          </span>
          <span style={TextStylesTitle}> will be done.</span>
        </Box>
      ) : (
        <>
          <Box className="non-dragable" style={boxStyles}>
            <span key="if-you-type" style={TextStylesTitle}>
              If you launch :{" "}
            </span>
            {props.keyObj.action.params.app_name}
            <BsTrash
              color="white"
              style={IconStyles}
              onClick={() => {
                deleteEvent(props.i);
              }}
            />
            <br></br>
            <span key="the-actions" style={TextStylesTitle}>
              The reaction :{" "}
            </span>
            <span key={props.keyObj.reactionId} style={TextStyles}>
              [{props.keyObj.reaction?.name ? props.keyObj.reaction?.name : "NAME ERROR"}]
            </span>
            <span style={TextStylesTitle}> will be done.</span>
          </Box>
        </>
      )}
    </>
  );
}
