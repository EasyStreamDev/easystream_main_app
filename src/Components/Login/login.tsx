import { Button, TextField } from "@mui/material";
import { makeStyles } from '@mui/styles';
import { inputLabelClasses } from "@mui/material/InputLabel";

import React from "react";

const useStyles = makeStyles({
  TextField: {
    width: "100%",
    '& label.Mui-focused': {
      color: '#f56f28'
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#f56f28',
      color: "#FFFFFF"
    },
    '& .MuiInput-underline': {
      borderBottomColor: '#f56f28',
      color: "#FFFFFF"
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#f56f28',
        color: "#FFFFFF"
      },
      '&:hover fieldset': {
        borderColor: '#f56f28',
        color: "#FFFFFF"
      },
      '&.Mui-focused fieldset': {
        borderColor: '#f56f28',
        color: "#FFFFFF"
      },
    },
  },
});

export const Login = () => {
  const classes = useStyles();
  const style = {
    Button: {
      borderColor: "#f56f28",
      color: "#FFFFFF",
      marginTop: "20px",
      '&:hover': {
        borderColor: "#f56f28",
        color: "#f56f28",
      },
    },
  }

  return (
    <>
      <h1>Login</h1>
      <TextField
          id="outlined-basic"
          label="Email"
          variant="outlined"
          onChange={e => {
            console.log('email'); 
            // handleChange(e, setFirstName)
          }}
          className={classes.TextField}
          sx={{ mb: 2, width: '200px', input: { color: "#FFFFFF" }}}
          InputLabelProps={{
            sx: {
              color: '#FFFFFF',
              [`&.${inputLabelClasses.shrink}`]: {
                color: "#f56f28"
              }
            }
          }}
        />
        <TextField
          id="outlined-basic"
          label="Password"
          variant="outlined"
          onChange={e => {
            console.log('email'); 
            // handleChange(e, setFirstName)
          }}
          className={classes.TextField}
          sx={{ mb: 2, width: '200px', input: { color: "#FFFFFF" }}}
          InputLabelProps={{
            sx: {
              color: '#FFFFFF',
              [`&.${inputLabelClasses.shrink}`]: {
                color: "#f56f28"
              }
            }
          }}
        />
        <Button
          variant="outlined"
          sx={style.Button}
          onClick={() => { console.log('test') }}
        > Login </Button>
    </>
  );
};
