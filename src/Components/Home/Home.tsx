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
        <Link className="m-2" to="/reports">Reports</Link>
				<Link className="m-2" to="/action/general">Generate Actions</Link>
				<Link className="m-2" to="/audio/mics-level">Mics Level</Link>
				<Link className="m-2" to="/audio/word-detection">Word Detection</Link>
				<Link className="m-2" to="/video/scenes">Scenes</Link>
				<Link className="m-2" to="/video/subtitles">Subtitles</Link>
				<Link className="m-2" to="/login">Login</Link>
      </>
    );
}
