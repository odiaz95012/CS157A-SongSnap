import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./views/Login";
import Registration from "./views/Registration";
import Home from "./views/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Login/>}/>
        <Route path="/registration" element={<Registration/>}/>
        <Route path="/home" element={<Home/>}/>
      </Routes>
    </Router>
  ); 
}

export default App;
