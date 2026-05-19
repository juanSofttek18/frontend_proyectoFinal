import { Routes, Route, Navigate } from "react-router-dom"; 
import SideBar from "./components/SideBar";
import DashBoard from "./views/Dashboard/DashBoard"; 
import ListClient from "./views/Clientes/ListClient";
import VehicleCatalog from "./views/Vehicles/VehicleCatalog";
import ListRequest from "./views/RequestView/ListRequest";
import "./App.css";

function App() {
  return (
    <div className="container">
      <SideBar />
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/requests" element={<ListRequest />} />
          <Route path="/clients" element={<ListClient />} />
          <Route path="/vehicles" element={<VehicleCatalog />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
