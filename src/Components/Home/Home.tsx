import React, { useEffect } from "react";
import {
	Routes,
	Route,
	Link
} from "react-router-dom";
import "./Home.css";
import { Button, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import OutlinedCard from "./CardsHome";
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

	const architecture = [
		{
			"url": "/actions-reactions/home",
			"title": "Actions & Reactions",
			"description": "Bind actions and reactions together to create autonomous systems !",
		},
		{
			"url": "/audio/compressor-level",
			"title": "Compressor Level",
			"description": "Use the Easystream useful compressor to help you configuring the audio.",
		},
		{
			"url": "/video/scenes",
			"title": "Scenes",
			"description": "Let Easystream change scene automatically.",
		},
		{
			"url": "/video/subtitles",
			"title": "Subtitles",
			"description": "Adapt you to your audience activating the auto generated subtitles !",
		},
		{
			"url": "/login",
			"title": "Login",
			"description": "Login you to access to all your features !",
		},
		{
			"url": "/other/feedback",
			"title": "Feedback",
			"description": "Don't hesitate to send us some feedback to upgrade our plugin <3",
		},
	]
	
    return (
      <>
	  	<h1 className="ip icon-visibility">
			your ip: { visibility ? ip : "*********" }
			<IconButton className="icon-visibility" onClick={ () => setvisibility(!visibility) } aria-label="visibility">
				{ visibility ? <Visibility/> : <VisibilityOff/> }
			</IconButton>
		</h1>

		<div className="container-home">

			{
				architecture.map((item: any, index: any) => {
					return (
						<div key={item.url} className="items-home">
							<Link className="m-2" to={item.url}>
								<OutlinedCard url={item.url} title={item.title} description={item.description}></OutlinedCard>
							</Link>
						</div>
					)
				})
			}

		</div>
      </>
    );
}
