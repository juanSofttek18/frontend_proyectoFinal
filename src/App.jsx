import { Route, Routes } from "react-router-dom"
import SideBar from "./components/SideBar"
import DashBoard from "./views/DashBoard/DashBoard"
import VehicleCatalog from "./views/Vehicles/VehicleCatalog"
import "./App.css"

const vehiclesPlaceHolder= () => <h2 className="placeholder-text">Vehicles</h2>;
const clientsPlaceHolder= () => <h2 className="placeholder-text">Clients</h2>;
const requestsPlaceHolder= () => <h2 className="placeholder-text">Requests</h2>;

function App() {
  return (
      <div className="app-container">
        <SideBar />
        <main className="main-content">
          <Routes>
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/vehicles" element={<VehicleCatalog />} />
            <Route path="/clients" element={<clientsPlaceHolder />} />
            <Route path="/requests" element={<requestsPlaceHolder />} />
          </Routes>
        </main>
      </div>
  )
}
export default App
