import React from 'react'
import Navbar from './components/layout/Navbar'
import Home from './components/Home'
import { Route, Routes } from 'react-router-dom'
import SignUp from './components/pages/SignUp'
import Login from './components/pages/Login'
import AddItem from './components/Items/AddItem'
import AddCategory from './components/Items/AddCategory'
import Menu from './components/menu/menu'
import ShowMenu from './components/Menu/ShowMenu'
import AdminTables from './components/Tables/AdminTables'
import Reservations from './components/Reservations-Pages/Reservations'
import UserReservation from './components/Reservations-Pages/UserReservation'
import AdminReservations from './components/Reservations-Pages/AdminReservations'


export default function App() {
  return<>

    <Navbar />
 <Routes>
  <Route path='/' element={<Home />} />
   <Route path="/signup" element={<SignUp />} />
   <Route path="/login" element={<Login />} />
   <Route path="/add-item" element={<AddItem />} />
   <Route path="/add-category" element={<AddCategory />} />
   <Route path="/menu" element={<Menu />} />
   <Route path="/menu/:id" element={<ShowMenu />} />
   <Route path="/admin-tables" element={<AdminTables/>} />
    <Route path="/reservations" element={<Reservations/>} />
    <Route path='/user/reservations' element={<UserReservation />} />
    <Route path='/admin/reservations' element={<AdminReservations />} />
    


  </Routes>
  </>
}
