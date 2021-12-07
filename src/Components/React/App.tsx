import '../Css/App.css'
// React
import React, { useState, useEffect } from 'react'
// Assets
import Sidebar from './Sidebar'
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Link
} from "react-router-dom";
import { Home } from './Home'
import { Product } from './Product'
import { Report } from './Report'

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
					</Routes>
				</div>
			</Router>
		</div>
	)
}
