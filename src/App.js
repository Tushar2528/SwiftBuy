
import './App.css';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import {Route, BrowserRouter, Routes } from 'react-router-dom';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { Navbar } from './Components/Navbar/Navbar';
import { Navbar1 } from './Components/Navbar1/Navbar1';
import { Home } from './Components/Home/Home';
import { Login } from './Components/Login/Login';
import { Register } from './Components/Register/Register';
import { Cart } from './Components/Cart/Cart';
import { Orders } from './Components/Orders/Orders';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { collection, addDoc } from 'firebase/firestore';
import { db } from "./firebaseinit";

function App() {

  const auth = getAuth();


  return (

    <BrowserRouter>
      
      <Routes>
        <Route  path='/' element={<><Navbar/><Home/></>} />
        <Route  path='/sign-in' element={<Login/>}/>
        
          <Route  path='/sign-up' element={<Register/>}/>
       
        <Route path='/:userid' element={<><Navbar1/><Home /></>}/>
        <Route path='/:userid/cart' element={<><Navbar1/><Cart /></>}/>
        <Route path='/:userid/orders' element={<><Navbar1/><Orders /></>}/>
        
        
        
      </Routes>
      <ToastContainer/>
    </BrowserRouter>
    

   
  );
}

export default App;






