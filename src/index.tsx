import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter,
  Routes,
  Route,
} from "react-router-dom";
import App from './App';
import ServiceDetails from "./ServiceDetails";
import Services from "./Services";

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Services />} />
          <Route path="services/:serviceID" element={<ServiceDetails />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);