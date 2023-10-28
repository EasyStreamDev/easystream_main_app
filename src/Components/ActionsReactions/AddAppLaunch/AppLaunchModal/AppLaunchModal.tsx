import { FormControl, InputLabel, MenuItem } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import "./AppLaunchModal.css";
// import { makeStyles } from "@mui/styles";
import Select from "@material-ui/core/Select";
import { createTheme, makeStyles } from "@material-ui/core/styles";

// Create a theme for the UnFocus mode
const themeUnFocus = createTheme({
  overrides: {
    MuiSelect: {
      select: {
        "&:focus": {
          background: "$labelcolor",
        },
      },
    },
  },
});

// Styles for the components
const style = {
  Box: {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "#222831",
    border: "1px solid orange",
    boxShadow: 24,
    p: 4,
    borderRadius: "10px",
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

// Styles for the select component
const useStyles = makeStyles({
  select: {
    "&:before": {
      borderColor: "#f56f28",
    },
    "&:after": {
      borderColor: "#f56f28",
    },
    "&:not(.Mui-disabled):hover::before": {
      borderColor: "#f56f28",
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
    },
  },
});

export const AppLaunchModal = (props: any) => {
  const classes = useStyles();

  return (
    <Modal
      open={props.open}
      onClose={() => props.closeWithoutSave()}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style.Box}>
        {/* Input box for app name */}
        <input
          style={{
            color: "white",
            backgroundColor: "#393E46",
            outline: "none",
            borderStyle: "Hidden",
            borderRadius: "10px",
            paddingTop: "1vh",
            paddingBottom: "1vh",
            paddingLeft: "1vw",
            marginBottom: "2vh",
            width: "100%",
          }}
          placeholder="Type the app name then press Enter"
          color="#f56f28"
          name="input-box"
          type="text"
          onKeyUp={(event) => {
            props.handleChange(event);
          }}
        />

        {/* App name */}
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          key={props.newEvent.keywords[0]}
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
          {props.newEvent.keywords[0]}
        </Typography>

        {/* Divider */}
        <div
          style={{
            color: "#f56f28",
            backgroundColor: "#f56f28",
            width: "100%",
            height: 1,
            marginBottom: 25,
          }}
        />

        {/* Sources */}
        {props.sources.length === 0 ? (
          <>
            <h4>No action found.</h4>
            <h5>You can create action in "Generate Action".</h5>
          </>
        ) : (
          <FormControl fullWidth sx={{ pb: "1vh", borderColor: "white" }}>
            <InputLabel id="demo-simple-select-label" className={classes.selectLabel}>
              reactions
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
              onChange={props.addSource}
            >
              {props.sources.map((source: any, index: number) => (
                <MenuItem value={source.name} key={index}>
                  {source.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Selected source */}
        {props.newEvent.source && props.newEvent.source.name ? (
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
              }}
            >
              {props.newEvent.source.name}
            </Typography>
          </Box>
        ) : (
          <>
            <h4>Source not selected.</h4>
          </>
        )}

        {/* Save button */}
        <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
          <Button onClick={() => props.save()} sx={{ color: "orange", flex: "1", mt: "2vh" }}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
