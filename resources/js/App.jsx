import React from 'react'
import Navbar from './components/layout/Navbar'
import Home from './components/Home/Home'
import { Route, Routes } from 'react-router-dom'
import SignUp from './components/pages/SignUp'
import Login from './components/pages/Login'
import AddItem from './components/Items/AddItem'
import AddCategory from './components/Items/AddCategory'
import Menu from './components/Menu/Menu'
import ShowMenu from './components/Menu/ShowMenu'
import AdminTables from './components/Tables/AdminTables'
import Reservations from './components/Reservations-Pages/Reservations'
import UserReservation from './components/Reservations-Pages/UserReservation'
import AdminReservations from './components/Reservations-Pages/AdminReservations'
import MyOrders from './components/Menu/MyOrders'
import AllOrders from './components/Menu/AllOrders'
import ItemShow from './components/Items/ItemShow'
import Inventory from './components/Inventory/Inventory'
import InvoiceShow from './components/Menu/InvoiceShow'
import InvoicesDashboard from './components/Menu/InvoicesDashboard'
import AdminShifts from './components/Shifts/AdminShifts'
import Staff from './components/Staff/Staff'
import StaffProfile from './components/Staff/StaffProfile'
import Footer from './components/layout/Footer'
import NotFound from './components/pages/NotFound'
import PrivateRoute from './components/pages/PrivateRoute'





export default function App() {
  return<>
   

    <Navbar />
 <Routes>

   <Route path="/signup" element={<SignUp />} />
   <Route path="/login" element={<Login />} />
  <Route path='/' element={<PrivateRoute><Home /></PrivateRoute>} />
   <Route path="/add-item" element={<PrivateRoute><AddItem /></PrivateRoute>} />
   <Route path="/items/:id" element={<PrivateRoute><ItemShow /></PrivateRoute>} />

   <Route path="/add-category" element={<PrivateRoute><AddCategory /></PrivateRoute>} />
   <Route path="/menu" element={<PrivateRoute><Menu /></PrivateRoute>}/>
   <Route path="/my-orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />
   <Route path="/menu/:id" element={<PrivateRoute><ShowMenu /></PrivateRoute>} />
   <Route path="/admin-tables" element={<PrivateRoute><AdminTables/></PrivateRoute>} />
    <Route path="/reservations" element={<PrivateRoute><Reservations/></PrivateRoute>} />
    <Route path='/user/reservations' element={<PrivateRoute><UserReservation /></PrivateRoute>} />
    <Route path='/admin/reservations' element={<PrivateRoute><AdminReservations /></PrivateRoute>} />
    <Route path='/AllOrders' element={<PrivateRoute><AllOrders /></PrivateRoute>} />
    <Route path="/inventory" element={<PrivateRoute><Inventory /></PrivateRoute>} />
    <Route path="/invoices/order/:orderId" element={<PrivateRoute><InvoiceShow /></PrivateRoute>} />
    <Route path="/invoices" element={<PrivateRoute><InvoicesDashboard/></PrivateRoute>} />
    <Route path="/Staff-Profile" element={<PrivateRoute><StaffProfile/></PrivateRoute>} />
    <Route path="/AdminShifts" element={<PrivateRoute><AdminShifts/></PrivateRoute>} />
    <Route path="/ManageStaff" element={<PrivateRoute><Staff/></PrivateRoute>} />
    <Route path="*" element={<NotFound />} />

  </Routes>
  <Footer />
 
  </>
}
