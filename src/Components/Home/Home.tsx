import React, { useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./Home.css";
import { Box, Button, CardContent, IconButton, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import OutlinedCard from "./CardsHome";
import { QRCode, encrypt } from "./QRcode";
import { BsQrCodeScan } from "react-icons/bs";
import AirlineStopsIcon from '@mui/icons-material/AirlineStops';
import MicIcon from '@mui/icons-material/Mic';
import ClosedCaptionIcon from '@mui/icons-material/ClosedCaption';
import CameraswitchIcon from '@mui/icons-material/Cameraswitch';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import useAuth from "../../hooks/useAuth.js";
import useLogout from "../../hooks/useLogout";
import { ModalSave } from "../ModalSave/ModalSave";

const ipcRenderer = window.require("electron").ipcRenderer;

export const Home = () => {
  const [ip, setip] = React.useState("");
  const [visibility, setvisibility] = React.useState(false);
  const [isHovering, setIsHovering] = React.useState(false);

  const [loginButton, setLoginButton] = React.useState<any>();

  const auth: any = useAuth();
  const logout = useLogout();

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
	
	const getLocalIp = (): Promise<string> => {
		return new Promise(async (resolve, reject) => {
		  const result: string = await ipcRenderer.sendSync("getLocalIP", "ping");
		  resolve(result);
		});
	};
	
	useEffect(() => {
		getLocalIp().then(res => {
			if (res.length > 0)
				setip(encrypt(res))
		});
	
	  }, []);

  const renderLoginButton = () => {
	console.log(auth)
	if (auth?.auth && auth?.auth?.email) {
		return (
			<Button onClick={logout} className="button-color-orange" variant="outlined" endIcon={<LogoutIcon />} color="warning">
				Logout
			</Button>
		)
	} else {
		return (
			<Link to="/login">
				<Button className="button-color-orange" variant="outlined" endIcon={<LoginIcon />} color="warning">
					Login
				</Button>
			</Link>
		)
	}
  }
  
  	useEffect(() => {
	  	getLocalIp().then((res) => {
      		if (res.length > 0) setip(encrypt(res));
    	});
  	}, []);

  	useEffect(() => {
		setLoginButton(renderLoginButton())
	}, [auth]);

	const architecture = [
		{
			"url": "/actions-reactions/home",
			"icon": <AirlineStopsIcon className="size-icon" />,
			"title": "Actions & Reactions",
			"description": "Bind actions and reactions together to create autonomous systems !",
		},
		{
			"url": "/audio/compressor-level",
			"icon": <MicIcon className="size-icon"/>,
			"title": "Compressor Level",
			"description": "Use the Easystream useful compressor to help you configuring the audio.",
		},
		{
			"url": "/video/link-mic-to-video-source",
			"icon": <CameraswitchIcon className="size-icon"/>,
			"title": "Link mic to Video Source",
			"description": "Automatic change of video source when mic is used.",
		},
		{
			"url": "/video/subtitles",
			"icon": <ClosedCaptionIcon className="size-icon"/>,
			"title": "Subtitles",
			"description": "Adapt you to your audience activating the auto generated subtitles !",
		},
		// {
		// 	"url": "/login",
		// 	"title": "Login",
		// 	"description": "Login you to access to all your features !",
		// },
		// {
		// 	"url": "/other/feedback",
		// 	"title": "Feedback",
		// 	"description": "Don't hesitate to send us some feedback to upgrade our plugin <3",
		// },
	]
	
    return (
      <>

		<div className="top-bar non-dragable">
			<div className="button-container">
				<div className="icon-visibility">
					{
						visibility ?
							<div onClick={() => setvisibility(!visibility)}
							onMouseEnter={handleMouseOver}
							onMouseLeave={handleMouseOut}
							className="qr-code"
							>
								<QRCode className="qr-code-content" value={ip}>
								</QRCode>
								{isHovering && (
									<VisibilityOff className="visibility-icon-off"></VisibilityOff>
								)}
							</div>
						:
							<Button style={{ color: 'white' }} onClick={() => setvisibility(!visibility)} endIcon={<BsQrCodeScan />}>
								Login on EasyStream app
							</Button>
					}
				</div>

				{ loginButton }

				{/* <Link to="/login">
					<Button className="button-color-orange" variant="outlined" endIcon={<LoginIcon />} color="warning">
						Login
					</Button>
				</Link> */}
			</div>
		</div>

      <div className="container-home">
        {architecture.map((item: any, index: any) => (
          <div key={item.url} className="items-home">
            <Link className="m-2" to={item.url}>
              <OutlinedCard url={item.url} title={item.title} icon={item.icon} description={item.description}></OutlinedCard>
            </Link>
          </div>
        ))}
      </div>
      <Button onClick={handleOpen}> Load Last save</Button>
      <Modal open={open} onClose={handleClose}>
        <ModalSave handleClose={handleClose}/>
      </Modal>
    </>
  );
};
