import { Routes, Route, Navigate } from "react-router-dom"; 
import SideBar from "./components/SideBar";
import DashBoard from "./views/Dashboard/DashBoard"; 
import "./App.css";

const ClientsPlaceholder = () => <h2 className="placeholder-text">Clients Module (Developer 2)</h2>;
const VehiclesPlaceholder = () => <h2 className="placeholder-text">Vehicles Catalogue (Developer 3)</h2>;
const RequestsPlaceholder = () => <h2 className="placeholder-text">Rental Requests Engine (Developer 4)</h2>;

function App() {
  return (
    <div className="container">
      <SideBar />
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/clients" element={<ClientsPlaceholder />} />
          <Route path="/vehicles" element={<VehiclesPlaceholder />} />
          <Route path="/requests" element={<RequestsPlaceholder />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
=======
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ListadoSolicitudes from './views/Solicitudes/ListadoSolicitudes';
const Clientes = () => <div style={{ fontSize: '1.5rem' }}>Página de Clientes</div>;
import Vehiculos from './views/Vehicles/VehicleCatalog'

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/solicitudes" replace />} />

          <Route path="/solicitudes" element={<ListadoSolicitudes />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/vehiculos" element={<Vehiculos />} />

          <Route path="*" element={<div>404 - Página no encontrada</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
>>>>>>> feature/SolitiudesView
