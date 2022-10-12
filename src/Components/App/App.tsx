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
import { Product } from '../Product/Product'
import { Report } from '../Report/Report'
import { MicsLevel } from '../MicsLevel/MicsLevel';
import { WordDetection } from '../WordDetection/WordDetection';
import { GeneralEvent } from '../Events/GeneralEvent';
import { AllMics, resultFormat } from '../../Socket/interfaces';
import { Scenes } from '../Scenes/Scenes';
const ipcRenderer = window.require('electron').ipcRenderer

export default function App() {

	const [response, setResponse] = useState('');

	const getAllMics = (): Promise<AllMics> => {
		return new Promise(async (resolve, reject) => {
			const result: AllMics = await ipcRenderer.sendSync('getAllMics', 'ping');
			console.log('getAllMics invoke', result);
			resolve(result);
		})
	}

	const setVolumeToMic = (micId: string, value: number): Promise<resultFormat> => {
		return new Promise(async (resolve, reject) => {
			const result: resultFormat = await ipcRenderer.sendSync('setVolumeToMic', {'micId': micId, 'value': value});
			console.log('setVolumeToMic invoke', result);
			resolve(result)
		});
	}

	useEffect(() => {
		setTimeout(() => {
			console.log('Call getAllMics');
			getAllMics()
			.then(_ => {
				setVolumeToMic('Audio Input Capture (PulseAudio)', 100)
				.then((res) => {
					if (res.statusCode === 200) {
						getAllMics()
						.then((allMics) => {
							console.log('FINALLY -> ', allMics);
						})
					}
				})
			})
		}, 5000);
		
		return () => { 
			console.log('unmounting');
			setResponse('');
		};
	}, []);

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
						<Route path='/products' element={<Product/>} />
						<Route path='/audio/mics-level' element={<MicsLevel/>} />
						<Route path='/audio/word-detection' element={<WordDetection/>} />
						<Route path='/events/general' element={<GeneralEvent/>} />
						<Route path='/audio/Scenes' element={<Scenes/>} />
					</Routes>
				</div>
			</Router>
		</div>
	)
}
