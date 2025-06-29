import React from 'react'
import Navbar from './components/layout/Navbar'
import Home from './components/Home'
import { Route, Routes } from 'react-router-dom'

export default function App() {
  return<>
  <Navbar />
 <Routes>
  <Route path='/' element={<Home userRole="user" userName='Mariam' />} />
  </Routes>
  </>
}
