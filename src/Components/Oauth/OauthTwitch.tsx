import { Outlet, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";

import { ElectronAuthProvider } from 'twitch-electron-auth-provider';

const OAUTHURL = "auth/Oauth";

const OauthTwitch = () => {
  const [accessToken, setAccessToken] = useState("");
  const navigate = useNavigate();
  const { Auth }: any = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    const fragment = window.location.hash.substring(1);
    const params = new URLSearchParams(fragment);
    const urlAccessToken : string = params.get("access_token") ?? "";

    setAccessToken(urlAccessToken);
    const getUser = async () => {
      try {
        const response = await axios.post(OAUTHURL, {
          token: urlAccessToken,
          headers: { "Content-Type": "application/json" },
        });
        const {email, roles, accessToken, refreshToken} = response.data;
        Auth({ email, roles, accessToken, refreshToken });
        navigate(from, { replace: true });
      } catch (err: any) {        
        console.error(err.response);
      }
    }
    getUser();
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
};

export default OauthTwitch;
