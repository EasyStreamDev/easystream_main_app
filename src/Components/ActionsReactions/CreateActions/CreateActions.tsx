import Button from "@mui/material/Button";
import { BsArrowReturnLeft, BsFonts, BsKeyboard, BsRocketTakeoff } from "react-icons/bs";
import { Link } from "react-router-dom";
import "./CreateActions.css";

export const CreateActions = () => {
  return (
    <>
      {/* Display a heading */}
      <h1 className="m-2"> Select an action</h1>

      {/* Link to the "Word Detection" page */}
      <Link className="m-6" to="/actions-reactions/word-detection">
        <Button variant="contained" size="large" startIcon={<BsFonts />} color="warning">
          Word Detection
        </Button>
      </Link>

      {/* Link to the "Key Pressed" page */}
      <Link className="m-6" to="/actions-reactions/key-pressed">
        <Button variant="contained" size="large" startIcon={<BsKeyboard />} color="warning">
          Key Pressed
        </Button>
      </Link>

      {/* Link to the "App Launch" page */}
      <Link className="m-6" to="/actions-reactions/app-launch">
        <Button variant="contained" size="large" startIcon={<BsRocketTakeoff />} color="warning">
          App Launch
        </Button>
      </Link>

      {/* Link to go back to the home page */}
      <Link className="go-back-link" to="/actions-reactions/home">
        <Button variant="outlined" startIcon={<BsArrowReturnLeft />} color="info">
          Go Back
        </Button>
      </Link>
    </>
  );
};
