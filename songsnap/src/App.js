import React, { useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./views/Login";
import Registration from "./views/Registration";
import Home from "./views/Home";
import Settings from "./views/Settings";
import Profile from "./views/Profile";
import AdminPage from "./views/AdminPage";
import AdminRoute from "./components/AdminRoute";
import Cookies from 'js-cookie';
import Friends from "./views/Friends";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  //Cookie reading is not working as of now

  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/profile/:accountID" element={<Profile />} />
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
