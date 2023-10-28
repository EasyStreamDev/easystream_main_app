import "./index.css";
// React
import React from "react";
import ReactDOM from "react-dom";
// code
import * as serviceWorker from "./serviceWorker";
// components
import App from "./Components/App/App";
import { HashRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";

ReactDOM.render(
  <HashRouter>
    <AuthProvider>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </AuthProvider>
  </HashRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
