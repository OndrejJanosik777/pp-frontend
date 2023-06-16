import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import LandingPage from './pages/p01-landing-page';
import P02_PLANNING_DASHBOARD from './pages/p02-planning-dashboard';
import Playground from './pages/p00-playground';
import P03_DOCUMENTS from './pages/p03-documents';
import P04_EMPLOYEES from './pages/p04-employees';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} ></Route>
      <Route path="/Dashboard/" element={<P02_PLANNING_DASHBOARD />} ></Route>
      <Route path="/documents/" element={<P03_DOCUMENTS />} ></Route>
      <Route path="/employees/" element={<P04_EMPLOYEES />} ></Route>
      <Route path="/playground/" element={<Playground />} ></Route>
    </Routes>
  </BrowserRouter>
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
