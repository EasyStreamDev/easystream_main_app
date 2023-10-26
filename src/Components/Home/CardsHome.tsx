import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

// Function component for rendering the card content
const card = (props: any) => (
  <React.Fragment>
    <CardContent
      sx={{
        color: "white",
        padding: "2vh",
        paddingBottom: "15px !important",
      }}
    >
      <Typography sx={{ fontWeight: "bold" }} variant="h5">
        {/* // Render the title prop */}
        {props.title}
      </Typography>
      <Typography variant="body2">
        {/* / Render the description prop
            // Render the description prop */}
        {props.description}
      </Typography>
    </CardContent>
  </React.Fragment>
);

// Main component for rendering the outlined card
export default function OutlinedCard(props: any) {
  return (
    <Box sx={{ height: "90%" }}>
      <Card
        variant="outlined"
        sx={{
          backgroundColor: "#565d68",
          border: "3px solid orange",
          borderRadius: "10px",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ":hover": {
            boxShadow: 20,
            transform: "scale(1.01)",
          },
        }}
      >
        {/* // Render the card content using the card component and
        pass the props */}
        {card(props)}
      </Card>
    </Box>
  );
}
