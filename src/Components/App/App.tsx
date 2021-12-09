import './App.css'
// React
import React, { useState, useEffect } from 'react'
// Assets
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
						<Route path='/products' element={<Product/>} />
						<Route path='/audio/mics-level' element={<MicsLevel/>} />
						<Route path='/audio/word-detection' element={<WordDetection/>} />
					</Routes>
				</div>
			</Router>
		</div>
	)
}
