import React from 'react'
import Navbar from './components/layout/Navbar'
import Home from './components/Home'
import { Route, Routes } from 'react-router-dom'
import SignUp from './components/pages/SignUp'
import Login from './components/pages/Login'

export default function App() {
  return<>

    <Navbar />
 <Routes>
  <Route path='/' element={<Home />} />
   <Route path="/signup" element={<SignUp />} />
   <Route path="/login" element={<Login />} />
  </Routes>
  </>
}
