import "./SideBar.css";
import { NavLink } from "react-router-dom";

function SideBar() {
  // Función auxiliar para mantener limpio el JSX y concatenar las clases correctamente
  const getNavLinkClass = ({ isActive }) =>
    isActive ? "menu-item menu-item-active" : "menu-item";

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <h2>Renting</h2>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={getNavLinkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/clients" className={getNavLinkClass}>
            Clients
          </NavLink>

          <NavLink to="/vehicles" className={getNavLinkClass}>
            Vehicles
          </NavLink>

          <NavLink to="/requests" className={getNavLinkClass}>
            Requests
          </NavLink>
        </nav>
      </div>
    </aside>
  );
}

export default SideBar;