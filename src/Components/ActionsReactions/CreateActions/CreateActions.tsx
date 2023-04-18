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
        <h1 className="m-2"> Select an action</h1>
        <Link className="m-6" to="/actions-reactions/word-detection">Word Detection</Link>
        <Link className="m-6" to="/actions-reactions/key-pressed">Key Pressed</Link>
        <Link className="m-6" to="/actions-reactions/app-launch">App Launch</Link>
        <Link className="go-back-link" to="/actions-reactions/home">Go Back</Link>
      </>
    );
}