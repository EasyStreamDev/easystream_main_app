import React from 'react';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Link
} from "react-router-dom";

export const Home = () => {
    return (
      <>
        <h1> Home</h1>
        <Link to="/reports">reports</Link>
		    <Link to="/products">products</Link>
		    <Link to="/audio/mics-level">Mics Level</Link>
		    <Link to="/audio/word-detection">Word Detection</Link>
      </>
    );
}
