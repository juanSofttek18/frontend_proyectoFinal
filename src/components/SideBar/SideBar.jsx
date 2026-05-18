import React from 'react';
import { NavLink } from 'react-router-dom';
import './SideBar.css';

// Define aquí los enlaces de tu aplicación
const navLinks = [
    { to: "/solicitudes", label: "Gestión de Solicitudes" },
    { to: "/clientes", label: "Clientes" },
    { to: "/vehiculos", label: "Vehículos" },
    // Puedes añadir más enlaces aquí
];

const SideBar = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h3>FinanCar</h3>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    {navLinks.map(link => (
                        <li key={link.to}>
                            <NavLink to={link.to} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                                {link.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default SideBar;