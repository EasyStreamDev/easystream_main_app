import React from 'react';
import {
	Routes,
	Route,
	Link
} from "react-router-dom";
import './CreateActions.css';

export const CreateActions = () => {
    return (
      <>
        {/* Display a heading */}
        <h1 className="m-2"> Select an action</h1>

        {/* Link to the "Word Detection" page */}
        <Link className="m-6" to="/actions-reactions/word-detection">Word Detection</Link>

        {/* Link to the "Key Pressed" page */}
        <Link className="m-6" to="/actions-reactions/key-pressed">Key Pressed</Link>

        {/* Link to the "App Launch" page */}
        <Link className="m-6" to="/actions-reactions/app-launch">App Launch</Link>

        {/* Link to go back to the home page */}
        <Link className="go-back-link" to="/actions-reactions/home">Go Back</Link>
      </>
    );
}
