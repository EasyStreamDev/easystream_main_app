import './App.css'
import React, { useState, useEffect } from 'react'
import Sidebar from '../Sidebar/Sidebar'
import {
	Routes,
	Route,
	Link,
	HashRouter
} from "react-router-dom";
import { Home } from '../Home/Home'
import { Subtitles } from '../Subtitles/Subtitles'
import { MicsLevel } from '../MicsLevel/MicsLevel';
import { ActionsReactions } from "../ActionsReactions/ActionsReactions"
import { WordDetection } from '../ActionsReactions/WordDetection/WordDetection';
import { KeyPressed } from '../ActionsReactions/KeyPressed/KeyPressed';
import { CreateReactions } from '../ActionsReactions/CreateReactions/CreateReactions';
import { Scenes } from '../Scenes/Scenes';
import { CreateActions } from '../ActionsReactions/CreateActions/CreateActions';
import { Feedback } from '../Other/Feedback/Feedback';

export default function App() {

	return (
		<div className='App'>
			<HashRouter>
				<div className='App-sidebar'>
					<Sidebar></Sidebar>
				</div>
				<div className='App-content'>
					<Routes>
						<Route path='/' element={<Home/>}/>
						<Route path='/other/feedback' element={<Feedback/>} />
						<Route path='/audio/mics-level' element={<MicsLevel/>} />
						<Route path='/video/scenes' element={<Scenes/>} />
						<Route path='/video/subtitles' element={<Subtitles/>} />
						<Route path='/actions-reactions/home' element={<ActionsReactions/>} />
						<Route path='/actions-reactions/actions' element={<CreateActions/>} />
						<Route path='/actions-reactions/word-detection' element={<WordDetection/>} /> 
						<Route path='/actions-reactions/key-pressed' element={<KeyPressed/>} /> 
						<Route path='/actions-reactions/reactions' element={<CreateReactions/>} />
					</Routes>
				</div>
			</HashRouter>
		</div>
	)
}
