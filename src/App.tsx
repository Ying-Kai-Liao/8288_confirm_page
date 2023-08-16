import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import AppBar from './components/appbar/AppBar';
import RouteComponent from './components/RouteComponent';

function App() {
  return (
    <div className='w-screen min-h-screen bg-slate-200 pb-10'>
      <BrowserRouter basename='/'>
        <AppBar />
        <div className='-mt-20'>
          <Routes>
            <Route path="/order_confirm" element={<RouteComponent />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
