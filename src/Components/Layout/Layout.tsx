import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import "./App.css";

const Layout = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export default Layout;
