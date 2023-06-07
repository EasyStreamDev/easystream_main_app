import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { BsArrowReturnLeft } from "react-icons/bs"

const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
    <>
      <h1>Unauthorized</h1>
      <br />
      <p>You do not have access to the requested page.</p>
      <p>Upgrade your subscription to access it.</p>
      <div className="flexGrow">
        <Button onClick={goBack} variant="outlined" startIcon={<BsArrowReturnLeft />} color="info">
          Go Back
        </Button>
      </div>
    </>
  );
};

export default Unauthorized;
