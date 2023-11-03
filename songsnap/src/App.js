import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./views/Login";
import Registration from "./views/Registration";
import Home from "./views/Home";
import Settings from "./views/Settings";
import Profile from "./views/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Login/>}/>
        <Route path="/registration" element={<Registration/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/settings" element={<Settings/>}/>
        <Route path="/profile" element={<Profile/>}/>
      </Routes>
    </Router>
  ); 
}

export default App;
