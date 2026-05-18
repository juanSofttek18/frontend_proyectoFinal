import { Routes, Route, Navigate } from "react-router-dom"; 
import SideBar from "./components/SideBar";
import DashBoard from "./views/Dashboard/DashBoard"; 
import ListClient from "./views/Clientes/ListClient"; // 👈 Corregido el nombre del archivo de Clientes
import VehicleCatalog from "./views/Vehicles/VehicleCatalog";
import "./App.css";

const RequestsPlaceholder = () => <h2 className="placeholder-text">Rental Requests Engine (Developer 4)</h2>;

function App() {
  return (
    <div className="container">
      <SideBar />
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/clients" element={<ListClient />} />
          <Route path="/vehicles" element={<VehicleCatalog />} />
          <Route path="/requests" element={<RequestsPlaceholder />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
