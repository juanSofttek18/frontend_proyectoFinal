import useDashBoard from "../../hooks/useDashBoard";
import "./DashBoard.css";

function DashBoard() {
    const { data, loading, error } = useDashBoard();

    const currentDate = new Date().toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    
    const rentedVehicles = data.totalVehicles - data.availableVehicles;
    const utilizationRate = data.totalVehicles > 0 
        ? Math.round((rentedVehicles / data.totalVehicles) * 100) 
        : 0;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Resumen en tiempo real del sistema de renting de vehículos</p>
                </div>
                <div className="date-badge">
                    {currentDate.charAt(0).toUpperCase() + currentDate.slice(1)}
                </div>
            </div>

            {loading ? (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                </div>
            ) : error ? (
                <div style={{ 
                    color: "#ef4444", 
                    padding: "2rem", 
                    textAlign: "center", 
                    background: "#fef2f2", 
                    borderRadius: "16px", 
                    border: "1px solid #fee2e2",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)"
                }}>
                    <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.25rem" }}>Error al cargar estadísticas</h3>
                    <p style={{ margin: 0 }}>{error}</p>
                </div>
            ) : (
                <div className="stats-grid">
                    {/* Solicitudes Totales */}
                    <div className="stat-card total">
                        <div className="card-top">
                            <h2>Solicitudes Totales</h2>
                            <div className="icon-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                            </div>
                        </div>
                        <p className="card-value">{data.totalRequests}</p>
                        <div className="card-footer-info">
                            <span>Historial completo acumulado</span>
                        </div>
                    </div>

                    {/* Solicitudes Aprobadas */}
                    <div className="stat-card approved">
                        <div className="card-top">
                            <h2>Aprobadas</h2>
                            <div className="icon-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                    <polyline points="9 11 11 13 15 9"></polyline>
                                </svg>
                            </div>
                        </div>
                        <p className="card-value">{data.approvedRequests}</p>
                        <div className="card-footer-info">
                            <span>Con y sin garantías adicionales</span>
                        </div>
                    </div>

                    {/* Solicitudes Denegadas */}
                    <div className="stat-card denied">
                        <div className="card-top">
                            <h2>Denegadas</h2>
                            <div className="icon-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                    <line x1="9" y1="9" x2="15" y2="15"></line>
                                    <line x1="15" y1="9" x2="9" y2="15"></line>
                                </svg>
                            </div>
                        </div>
                        <p className="card-value">{data.deniedRequests}</p>
                        <div className="card-footer-info">
                            <span>Rechazadas por scoring/riesgo</span>
                        </div>
                    </div>

                    {/* Solicitudes Pendientes */}
                    <div className="stat-card pending">
                        <div className="card-top">
                            <h2>Pendientes Analista</h2>
                            <div className="icon-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                            </div>
                        </div>
                        <p className="card-value">{data.pendingRequests}</p>
                        <div className="card-footer-info">
                            <span>Esperando resolución manual</span>
                        </div>
                    </div>

                    {/* Clientes Activos */}
                    <div className="stat-card clients">
                        <div className="card-top">
                            <h2>Clientes Registrados</h2>
                            <div className="icon-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                            </div>
                        </div>
                        <p className="card-value">{data.totalCustomers}</p>
                        <div className="card-footer-info">
                            <span>Clientes activos en el sistema</span>
                        </div>
                    </div>

                    {/* Vehículos e Inventario */}
                    <div className="stat-card vehicles">
                        <div className="card-top">
                            <h2>Vehículos Libres</h2>
                            <div className="icon-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="1" y="3" width="15" height="13"></rect>
                                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                                </svg>
                            </div>
                        </div>
                        <p className="card-value">{data.availableVehicles} <span style={{ fontSize: "1.25rem", color: "#64748b", fontWeight: "600" }}>/ {data.totalVehicles}</span></p>
                        
                        <div style={{ marginTop: "0.75rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#64748b", fontWeight: "600" }}>
                                <span>Tasa de Alquiler</span>
                                <span>{utilizationRate}% ocupación</span>
                            </div>
                            <div className="progress-container">
                                <div className="progress-bar" style={{ width: `${utilizationRate}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DashBoard;