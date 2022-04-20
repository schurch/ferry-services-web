import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import App from './App';
import ServiceDetails from "./ServiceDetails";
import Services from "./Services";

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Services />} />
          <Route path="services/:serviceID" element={<ServiceDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);