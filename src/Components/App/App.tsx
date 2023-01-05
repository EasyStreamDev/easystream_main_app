import './App.css'
import React, { useState, useEffect } from 'react'
import Sidebar from '../Sidebar/Sidebar'
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Link
} from "react-router-dom";
import { Home } from '../Home/Home'
import { Subtitles } from '../Subtitles/Subtitles'
import { Report } from '../Report/Report'
import { MicsLevel } from '../MicsLevel/MicsLevel';
import { WordDetection } from '../WordDetection/WordDetection';
import { GeneralActions } from '../Actions/GeneralActions';
import { Scenes } from '../Scenes/Scenes';

export default function App() {

	return (
		<div className='App'>
			<Router>
				<div className='App-sidebar'>
					<Sidebar></Sidebar>
				</div>
				<div className='App-content'>
					<Routes>
						<Route path='/' element={<Home/>}/>
						<Route path='/reports' element={<Report/>} />
						<Route path='/audio/mics-level' element={<MicsLevel/>} />
						<Route path='/audio/word-detection' element={<WordDetection/>} />
						<Route path='/video/scenes' element={<Scenes/>} />
						<Route path='/video/subtitles' element={<Subtitles/>} />
						<Route path='/action/general' element={<GeneralActions/>} />
					</Routes>
				</div>
			</Router>
		</div>
	)
}
