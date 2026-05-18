import { BrowserRouter, Route, Router } from "react-router-dom"
import SideBar from "./components/SideBar"
import DashBoard from "./views/DashBoard"
import "App.css"

const vehiclesPlaceHolder= () => <h2 className="placeholder-text">Vehicles</h2>;
const clientsPlaceHolder= () => <h2 className="placeholder-text">Clients</h2>;
const requestsPlaceHolder= () => <h2 className="placeholder-text">Requests</h2>;

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <SideBar />
        <main className="main-content">
          <Router>
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/vehicles" element={<vehiclesPlaceHolder />} />
            <Route path="/clients" element={<clientsPlaceHolder />} />
            <Route path="/requests" element={<requestsPlaceHolder />} />
          </Router>
        </main>
      </div>
    </BrowserRouter>
  )
}
export default App
