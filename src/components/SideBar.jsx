import "./SideBar.css";
import { NavLink } from "react-router-dom";

function SideBar() {
  return (
    <aside className="sidebar">
        <div className="sidebar-brand">
            <h2>Renting</h2>
        </div>
        <nav className="sidebar-nav">
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "menu-item-active" : "menu-item")}>
                Dashboard
            </NavLink>
            <NavLink to="/clients" className={({ isActive }) => (isActive ? "menu-item-active" : "menu-item")}>
                Clients
            </NavLink>
            <NavLink to="/vehicles" className={({ isActive }) => (isActive ? "menu-item-active" : "menu-item")}>
                Vehicles
            </NavLink>
             <NavLink to="/requests" className={({ isActive }) => (isActive ? "menu-item-active" : "menu-item")}>
                Requests
            </NavLink>  
        </nav>
    </aside>
  );
}

export default SideBar;