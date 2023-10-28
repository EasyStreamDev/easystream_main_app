import Button from "@mui/material/Button";
import { BsArrowReturnLeft, BsFonts, BsKeyboard, BsRocketTakeoff } from "react-icons/bs";
import { Link } from "react-router-dom";
import "./CreateActions.css";

export const CreateActions = () => {
  return (
    <>
      {/* Display a heading */}
      <h1 className="m-2">Select an action</h1>

      {/* Link to the "Word Detection" page */}
      <Link className="m-6" to="/actions-reactions/word-detection">
        <Button className="action-button-orange" variant="contained" size="large" startIcon={<BsFonts />}>
          <div style={{ display: "flex" }}>Word Detection</div>
        </Button>
      </Link>

      {/* Link to the "Key Pressed" page */}
      <Link className="m-6" to="/actions-reactions/key-pressed">
        <Button className="action-button-orange" variant="contained" size="large" startIcon={<BsKeyboard />}>
          Key Pressed
        </Button>
      </Link>

      {/* Link to the "App Launch" page */}
      <Link className="m-6" to="/actions-reactions/app-launch">
        <Button className="action-button-orange" variant="contained" size="large" startIcon={<BsRocketTakeoff />}>
          App Launch
        </Button>
      </Link>

      {/* Link to go back to the home page */}
      <Link style={{ paddingTop: "80px" }} to="/actions-reactions/home">
        <Button className="go-back-button" variant="outlined" startIcon={<BsArrowReturnLeft />} color="info">
          Go Back
        </Button>
      </Link>
    </>
  );
};
