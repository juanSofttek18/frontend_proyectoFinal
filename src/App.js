import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ListadoSolicitudes from './views/Solicitudes/ListadoSolicitudes';

// Componentes de ejemplo para otras rutas. Reemplázalos por los tuyos.
const Clientes = () => <div style={{ fontSize: '1.5rem' }}>Página de Clientes</div>;
const Vehiculos = () => <div style={{ fontSize: '1.5rem' }}>Página de Vehículos</div>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Todas las rutas dentro de Layout tendrán el SideBar */}
        <Route element={<Layout />}>
          {/* Redirige la ruta raíz a la página de solicitudes */}
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