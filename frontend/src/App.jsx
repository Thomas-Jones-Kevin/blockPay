import { useState } from 'react'
import {Routes,BrowserRouter,Route,} from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import Login from './Login'
import Signup from './Signup'
import Home from './Home'
import BatteryManage from './BatteryManage';
import BudgetManage from './BudgetManage';
import Transaction from './Transaction';
import UserDetails from './UserDetails'
import BlockchainVisualizer from './BlockchainVisualizer'

function App() {
  return(
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Navigate to='/login'/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/Signup' element={<Signup/>}/>
      <Route path='/Home' element={<Home/>}/>
      <Route path='/BatteryManage' element={<BatteryManage/>}/>
      <Route path='/BudgetManage' element={<BudgetManage/>}/>
      <Route path='/UserDetails' element={<UserDetails/>}/>
      <Route path='/BlockchainVisualizer' element={<BlockchainVisualizer/>}/>
      <Route path='/Transaction' element={<Transaction/>}/>
    </Routes>
  </BrowserRouter>
  )
}

export default App
