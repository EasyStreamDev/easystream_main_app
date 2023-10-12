import './App.css'
import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import {
	Routes,
	Route,
	Link,
	HashRouter
} from "react-router-dom";
import { Home } from "../Home/Home";
import { Subtitles } from "../Subtitles/Subtitles";
import { CompressorLevel } from "../CompressorLevel/CompressorLevel";
import { WordDetection } from "../ActionsReactions/WordDetection/WordDetection";
import { Login } from "../Login/login";
import Layout from "../Layout/Layout";
import RequireAuth from "../Auth/RequireAuth";
import { SubscriptionTypeEnumObject } from "../../Types";
import Unauthorized from "../Unauthorized/Unauthorized";
import { ActionsReactions } from "../ActionsReactions/ActionsReactions"
import { KeyPressed } from '../ActionsReactions/KeyPressed/KeyPressed';
import { CreateActions } from '../ActionsReactions/CreateActions/CreateActions';
import { CreateReactions } from '../ActionsReactions/CreateReactions/CreateReactions'
import { Feedback } from '../Other/Feedback/Feedback';
import { AppLaunch } from '../ActionsReactions/AppLaunch/AppLaunch';
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import { LinkMicToVideoSource } from '../LinkMicToVideoSource/LinkMicToVideoSource';

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
              <Route path="/*" element={<Home />} />
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
						  <Route path='/video/subtitles' element={<Subtitles/>} />
						  <Route path='/actions-reactions/home' element={<ActionsReactions/>} />
						  <Route path='/actions-reactions/actions' element={<CreateActions/>} />
						  <Route path='/actions-reactions/key-pressed' element={<KeyPressed/>} /> 
						  <Route path='/actions-reactions/app-launch' element={<AppLaunch/>} /> 
						  <Route path='/actions-reactions/reactions' element={<CreateReactions/>} />
              <Route path='/other/feedback' element={<Feedback/>} />

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
                <Route path="/audio/compressor-level" element={<CompressorLevel />} />
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
                <Route path="/video/link-mic-to-video-source" element={<LinkMicToVideoSource />} />
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
                  path='/actions-reactions/word-detection'
                  element={<WordDetection />}
                />
              </Route>
            </Route>
          </Routes>
		      <ToastContainer position="bottom-right" newestOnTop />
        </div>
      </div>
    </>
  );
}
