import { Button, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { inputLabelClasses } from "@mui/material/InputLabel";
import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./login.css";

import React from "react";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";

const LOGIN_URL = "/auth/login";

const useStyles = makeStyles({
  TextField: {
    width: "100%",
    "& label.Mui-focused": {
      color: "#ffa500",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#ffa500",
      color: "#FFFFFF",
    },
    "& .MuiInput-underline": {
      borderBottomColor: "#ffa500",
      color: "#FFFFFF",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#ffa500",
        color: "#FFFFFF",
      },
      "&:hover fieldset": {
        borderColor: "#ffa500",
        color: "#FFFFFF",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#ffa500",
        color: "#FFFFFF",
      },
    },
  },
});

export const Login = () => {
  const classes = useStyles();
  const style = {
    Button: {
      borderColor: "#ffa500",
      color: "#FFFFFF",
      marginTop: "20px",
      // "&:hover": {
      //   borderColor: "#ffa500",
      //   color: "#ffa500",
      // },
    },
  };

  const { setAuth }: any = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const emailRef = useRef<any>(null);
  const errRef = useRef<any>(null);

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, pwd]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.post(LOGIN_URL, {
        email: email,
        password: pwd,
        headers: { "Content-Type": "application/json" },
        // withCredentials: true,
      });
      // console.log(response)
      // console.log(JSON.stringify(response?.data));
      // console.log(JSON.stringify(response));
      const accessToken = response?.data?.accessToken;
      const refreshToken = response?.data?.refreshToken;
      const roles = response?.data?.roles;
      const subscription = response?.data?.subscription;
      setAuth({ email, roles, accessToken, refreshToken, subscription });
      setEmail("");
      setPwd("");
      navigate(from, { replace: true });
      console.log(response?.data);
    } catch (err: any) {
      if (!err?.response) {
        toast("No Server Response.", {
          type: "error",
        });
        setErrMsg("No Server Response.");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing email or Password.");
        toast("Missing email or Password.", {
          type: "error",
        });
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
        toast("Unauthorized.", {
          type: "error",
        });
      } else {
        setErrMsg("Login Failed");
        toast("Login Failed.", {
          type: "error",
        });
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      <div
        style={{
          width: "25vw",
          maxWidth: "800px",
          minWidth: "300px",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          display: "flex",
        }}
      >
        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
          {errMsg}
        </p>
        <h1>Login</h1>
        <TextField
          id="outlined-basic"
          label="Email"
          variant="outlined"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          ref={emailRef}
          value={email}
          className={classes.TextField}
          required
          sx={{ mb: 2, width: "200px", input: { color: "#FFFFFF" } }}
          InputLabelProps={{
            sx: {
              color: "#FFFFFF",
              [`&.${inputLabelClasses.shrink}`]: {
                color: "#ffa500",
              },
            },
          }}
        />
        <TextField
          id="outlined-basic"
          label="Password"
          variant="outlined"
          type="password"
          onChange={(e) => {
            setPwd(e.target.value);
          }}
          required
          value={pwd}
          className={classes.TextField}
          sx={{ mb: 2, width: "200px", input: { color: "#FFFFFF" } }}
          InputLabelProps={{
            sx: {
              color: "#FFFFFF",
              [`&.${inputLabelClasses.shrink}`]: {
                color: "#ffa500",
              },
            },
          }}
        />
        <Button className="button-color-orange" variant="outlined" onClick={handleSubmit}>
          Login
        </Button>
      </div>
    </>
  );
};
