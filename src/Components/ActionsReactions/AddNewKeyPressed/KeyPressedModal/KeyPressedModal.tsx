// Importing necessary dependencies and styles
import './KeyPressedModal.css'
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { BsTrash } from "react-icons/bs";
import { Divider, FormControl, InputLabel, MenuItem, withStyles } from "@mui/material";
import { AiOutlineMinus } from "react-icons/ai";
import CSS from "csstype";
import { SxProps } from '@mui/system';
import { BorderColorRounded } from '@material-ui/icons';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// Creating a custom theme
const themeUnFocus = createTheme({
  overrides: {
    MuiSelect: {
      select: {
        "&:focus": {
          background: "$labelcolor"
        }
      }
    }
  }
});

// Styles for different components
const style = {
  Box: {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "#222831",
    border: "1px solid #FD7014",
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

// Custom styles using makeStyles hook
const useStyles = makeStyles({
  select: {
    "&:before": {
      borderColor: "#f56f28"
    },
    "&:after": {
      borderColor: "#f56f28"
    },
    '&:not(.Mui-disabled):hover::before': {
      borderColor: '#f56f28',
    },
  },
  icon: {
    fill: "#f56f28",
  },
  root: {
    color: "#f56f28",
  },
  selectLabel: {
    fontSize: "15px",
    "&.MuiInputLabel-root": {
      color: "white",
    },
    "&.Mui-focused": {
      color: "#f56f28",
    }
  }
})

/**
 * Defining the KeyPressedModal component
 * @param props 
 * @returns 
 */
export const KeyPressedModal = (props: any) => {
  const classes = useStyles()
  const [open, setOpen] = useState(false); // State variable to track the open state of the dialog
  const [key, setKey] = useState(''); // State variable to store the pressed key

  /**
   * Function to handle opening the dialog
   */
  const handleClickOpen = () => {
    setOpen(true);
  };

  /**
   * Function to handle closing the dialog
   */
  const handleClose = () => {
    setOpen(false);
  };

  /**
   * Function to handle key press event
   * @param event 
   */
  const handleKeyPress = (event: any) => {
    setKey(event.key);
    props.handleChange(event.key); // Call the handleChange function from props with the pressed key
    handleClose();
  };

  return (
    <Modal
      open={props.open}
      onClose={() => props.closeWithoutSave()} // Call the closeWithoutSave function from props
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
        <Box sx={style.Box}>

          <Button variant="outlined" color="primary" onClick={handleClickOpen}>
          Click to select key
          </Button>
          <Dialog
            open={open}
            onClose={handleClose}
            onKeyPress={handleKeyPress}
          >
            <DialogTitle>Key Press</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please press any key
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>

          <div
            style={{
              marginBottom: 25
            }}
          />

          <h4>Key pressed: {key}</h4>

          <div
            style={{
              color: "#f56f28",
              backgroundColor: "#f56f28",
              width: "100%",
              height: 1,
              marginBottom: 25
            }}
          />

          {
            props.sources.length === 0 ? (
              <>
                <h4>No action found.</h4>
                <h5>You can create action in "Generate Action".</h5>
              </>
            ) : (
              <FormControl fullWidth sx={{ pb: "1vh", borderColor: "white" }}>
                <InputLabel
                  id="demo-simple-select-label"
                  className={classes.selectLabel}>
                  sources
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  inputProps={{
                    classes: {
                      icon: classes.icon,
                      root: classes.root,
                    },
                  }}
                  value={props.sources}
                  label="sources"
                  onChange={props.addSource}>
                  {
                    props.sources.map((source: any, index: number) => (
                      <MenuItem value={source.name} key={index}>
                        {source.name}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            )
          }
          {
            props.newEvent.source && props.newEvent.source.name ? (
              <Box
                key={props.newEvent.source.name}
                className="typography-item"
                sx={{ color: "white", columns: 2, cursor: "pointer" }}
                >
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                  key={props.newEvent.source.name}
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
                  }}>
                  {props.newEvent.source.name}
                </Typography>
              </Box>
            ) : (
              <>
                <h4>Source not selected.</h4>
              </>
            )
          }
          <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
            <Button
              onClick={() => props.save()} // Call the save function from props
              sx={{ color: "#FD7014", flex: "1", mt: "2vh" }}>
              Save
            </Button>
          </Box>
        </Box>
    </Modal>
  );
};
