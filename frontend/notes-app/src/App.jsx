import React from "react";
import './index.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";

const RoutesComponent = () => {
  return (
      <Router>
        <Routes>
        <Route path="/dashboard" exact element={<Home />} />
        <Route path="/login" exact element={<Login />} />
        <Route path="/signup" exact element={<SignUp />} />
        </Routes>
      </Router>
  )
}

const App = () => {
  return (
    <div>
      <RoutesComponent />
    </div>
  )
}

export default App;