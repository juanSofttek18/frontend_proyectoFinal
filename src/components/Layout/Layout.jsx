import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from '../SideBar/SideBar';
import './Layout.css';

const Layout = () => {
    return (
        <div className="app-layout">
            <SideBar />
            <main className="main-content">
                <Outlet /> {/* Las rutas hijas se renderizarán aquí */}
            </main>
        </div>
    );
};

export default Layout;