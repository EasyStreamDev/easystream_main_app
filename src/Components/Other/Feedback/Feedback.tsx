import React from 'react';
import { useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import "./Feedback.css";

export const Feedback = () => {
  const [message, setMessage] = useState("");
  const axiosPrivate = useAxiosPrivate();
  
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    
    try {
      const response = await axiosPrivate.post("/feedBacks/create", {
        message,
      });
      toast("Your feedback has been sent successfully !", {
        type: "success"
      });
      setMessage("");
    } catch (err) {
      console.error(err);
      toast("Internet connection issues. Please check your connection.", {
        type: "error"
      });
    }
  }

  return (
    <section style={{
      width: "100%",
      maxWidth: "420px",
      minHeight: "400px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      padding: "1rem",
      backgroundColor: "rgba(0,0,0,0.4)",
    }}>
      <h1 style={{color: "#f56f28"}}>FeedBack member Page</h1>
      <br />
      <form onSubmit={handleSubmit}>
        <div>
          <label
          htmlFor="text">
            feedBack:</label>
        </div>
        <input
          type="text"
          id="message"
          autoComplete="off"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          style={{
            marginTop: "1rem",
            width: "100%",
            padding: "0.5rem",
            borderRadius: "1rem",
            fontSize: "1rem",
          }}
          required
        />
        <div style={{
          display: "flex",
          justifyContent: "center",
        }}>
          <button style={{
            borderColor: "#f56f28",
            width: "175px",
            backgroundColor: "transparent",
            color: "#FFFFFF",
            fontSize: "20px",
            margin: "1rem",
            padding: "0.5rem",
            borderRadius: "0.5rem",
          }}>submit</button>
        </div>
      </form>
    </section>
  );
}
