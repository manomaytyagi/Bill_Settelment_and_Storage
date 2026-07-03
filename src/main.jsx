import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Login from './pages/Login.jsx';
import Admin from './pages/Admin.jsx';
import './index.css';

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path = "/" element={<App />} />
      <Route path = "/admin" element={<Login />} />
      <Route path = "/admin/dasboard" element={<Admin />} />
    </Routes>
  </BrowserRouter>
)