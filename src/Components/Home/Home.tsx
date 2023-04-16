import React, { useEffect } from "react";
import {
	Routes,
	Route,
	Link
} from "react-router-dom";
import "./Home.css";
import { Button, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@material-ui/icons";
const ipcRenderer = window.require("electron").ipcRenderer;


export const Home = () => {
	const [ip, setip] = React.useState("");
	const [visibility, setvisibility] = React.useState(false);
	
	const getLocalIp = (): Promise<string> => {
		return new Promise(async (resolve, reject) => {
		  const result: string = await ipcRenderer.sendSync("getLocalIP", "ping");
		  resolve(result);
		});
	};
	
	useEffect(() => {
		getLocalIp().then(res => {
			if (res.length > 0)
				setip(res)
		});
	
	  }, []);
	
    return (
      <>
	  	<h1 className="ip">
			your ip: { visibility ? ip : "*********" }
			<IconButton className="icon-visibility" onClick={ () => setvisibility(!visibility) } aria-label="visibility">
				{ visibility ? <Visibility/> : <VisibilityOff/> }
			</IconButton>
		</h1>

        <h1> Home</h1>
				<Link className="m-2" to="/actions-reactions/home">ActionsReactions</Link>
				<Link className="m-2" to="/audio/compressor-level">Compressor Level</Link>
				<Link className="m-2" to="/video/scenes">Scenes</Link>
				<Link className="m-2" to="/video/subtitles">Subtitles</Link>
				<Link className="m-2" to="/login">Login</Link>
        <Link className="m-2" to="/other/feedback">Feedback</Link>
      </>
    );
}
