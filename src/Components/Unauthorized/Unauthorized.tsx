import React from "react";
import { useNavigate } from "react-router-dom";

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
        <button onClick={goBack}>Go Back</button>
      </div>
    </>
  );
};

export default Unauthorized;
