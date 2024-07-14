import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import Playground from './pages/p00-playground';
import PLAYGOUND_02 from './pages/p00-playground_02';
import P01_LANDING_PAGE from './pages/p01-landing-page';
import P02_PLANNING_DASHBOARD from './pages/p02-planning-dashboard';
import P03_DOCUMENTS from './pages/p03-documents';
import P04_EMPLOYEES from './pages/p04-employees';
import P05_TEST_CENTER from './pages/p05-test-center';
import P06_HAND_CALCULATIONS from './pages/p06-hand-calculations';
import reportWebVitals from './reportWebVitals';
import store from './app/store/store';
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<P01_LANDING_PAGE />} ></Route>
        <Route path="/Dashboard/" element={<P02_PLANNING_DASHBOARD />} ></Route>
        <Route path="/playground_02/" element={<PLAYGOUND_02 />} ></Route>
        <Route path="/documents/" element={<P03_DOCUMENTS />} ></Route>
        <Route path="/employees/" element={<P04_EMPLOYEES />} ></Route>
        <Route path="/test-center/" element={<P05_TEST_CENTER />} ></Route>
        <Route path="/hand-calculations/" element={<P06_HAND_CALCULATIONS />} ></Route>
        <Route path="/playground/" element={<Playground />} ></Route>
      </Routes>
    </BrowserRouter>
  </Provider>
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
