import "./App.css";
import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Home } from "../Home/Home";
import { Subtitles } from "../Subtitles/Subtitles";
import { Report } from "../Report/Report";
import { MicsLevel } from "../MicsLevel/MicsLevel";
import { WordDetection } from "../WordDetection/WordDetection";
import { GeneralActions } from "../Actions/GeneralActions";
import { Scenes } from "../Scenes/Scenes";
import { Login } from "../Login/login";
import Layout from "../Layout/Layout";
import RequireAuth from "../Auth/RequireAuth";
import { SubscriptionTypeEnumObject } from "../../Types";
import Unauthorized from "../Unauthorized/Unauthorized";

const ipcRenderer = window.require("electron").ipcRenderer;

export default function App() {
  return (
    <>
      <div className="App">
        <div className="App-sidebar">
          <Sidebar></Sidebar>
        </div>
        <div className="App-content">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reports" element={<Report />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              <Route
                element={
                  <RequireAuth
                    allowedSubscriptions={[
                      SubscriptionTypeEnumObject.MEMBER,
                      SubscriptionTypeEnumObject.CLASSIC,
                      SubscriptionTypeEnumObject.GOLD,
                      SubscriptionTypeEnumObject.ILLIMITED,
                    ]}
                  />
                }
              >
                <Route path="/audio/mics-level" element={<MicsLevel />} />
                <Route path="/action/general" element={<GeneralActions />} />
              </Route>

              <Route
                element={
                  <RequireAuth
                    allowedSubscriptions={[
                      SubscriptionTypeEnumObject.CLASSIC,
                      SubscriptionTypeEnumObject.GOLD,
                      SubscriptionTypeEnumObject.ILLIMITED,
                    ]}
                  />
                }
              >
                <Route path="/video/scenes" element={<Scenes />} />
              </Route>
              <Route
                element={
                  <RequireAuth
                    allowedSubscriptions={[
                      SubscriptionTypeEnumObject.GOLD,
                      SubscriptionTypeEnumObject.ILLIMITED,
                    ]}
                  />
                }
              >
                <Route path="/video/subtitles" element={<Subtitles />} />
              </Route>
              <Route
                element={
                  <RequireAuth
                    allowedSubscriptions={[
                      SubscriptionTypeEnumObject.ILLIMITED,
                    ]}
                  />
                }
              >
                <Route
                  path="/audio/word-detection"
                  element={<WordDetection />}
                />
              </Route>
            </Route>
          </Routes>
        </div>
      </div>
    </>
  );
}
