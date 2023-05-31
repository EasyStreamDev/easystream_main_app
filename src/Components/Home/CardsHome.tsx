import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const card = (props: any) => {
    return (
    <React.Fragment>
        <CardContent sx={{ "color": "white" }}>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                { props.type }
            </Typography>
            <Typography sx={{ fontWeight: "bold" }} variant="h5" component="div">
                { props.title }
            </Typography>
            <Typography variant="body2">
                { props.description }
            </Typography>
        </CardContent>
    </React.Fragment>
    )
}

export default function OutlinedCard(props: any) {
  return (
    <Box>
      <Card variant="outlined" sx={{ backgroundColor: "#565d68", border: "3px solid orange",
      ':hover': {
            boxShadow: 20,
            transform: "scale(1.01)"
        }, }}>{card(props)}</Card>
    </Box>
  );
}