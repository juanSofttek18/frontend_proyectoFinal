import React, { useState } from 'react';
import { useRequest } from '../../hooks/useRequest';
import FormularioSolicitud from './FormRequest';
import EditRequest from './EditRequest';
import './ListRequest.css';

export default function ListRequest() {
    const { requests, loading, error, deleteRequest, updateRequestStatus, updateRequest, refetchRequests } = useRequest();
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [editingRequest, setEditingRequest] = useState(null);

    const handleFormSubmit = async () => {
        setMostrarFormulario(false);
        setEditingRequest(null);
        await refetchRequests();
    };

    const handleEditClick = (solicitud) => {
        setEditingRequest(solicitud);
    };

    const handleResolve = async (id, status) => {
        const confirmacion = window.confirm(`¿Está seguro de cambiar el estado de la solicitud #${id} a ${status}?`);
        if (!confirmacion) return;
        try {
            await updateRequestStatus(id, status);
        } catch (err) {}
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                </div>
            );
        }
        if (error) {
            return <div className="error-message">{error}</div>;
        }
        if (!requests || requests.length === 0) {
            return <div className="empty-message">No hay solicitudes pendientes para el analista.</div>;
        }

        return (
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>DNI Cliente</th>
                    <th>Detalle de Vehículos y Extras</th>
                    <th>Plazo</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {requests.map(solicitud => {
                    const estadoClase = solicitud.state ? solicitud.state.toLowerCase() : 'pending_analyst';
                    const lineasVehiculos = solicitud.vehicles || solicitud.detalles || [];

                    return (
                        <tr key={solicitud.id}>
                            <td>{solicitud.id}</td>
                            <td>{solicitud.clienteDni || solicitud.dniCliente || 'N/A'}</td>
                            <td>
                                <div className="vehicles-summary-cell">
                                    {lineasVehiculos.length === 0 ? (
                                        <span className="text-muted">Sin vehículos asignados</span>
                                    ) : (
                                        <ul className="vehicles-list-summary">
                                            {lineasVehiculos.map((linea, index) => {
                                                const brand = linea.vehiculo?.brand || linea.brand || '';
                                                const model = linea.vehiculo?.model || linea.model || '';
                                                const extrasList = linea.extras || [];
                                                return (
                                                    <li key={index} className="vehicle-summary-item">
                                                        <strong>{brand} {model}</strong> {linea.color && `(${linea.color})`}
                                                        {extrasList.length > 0 && (
                                                            <div className="extras-summary-list">
                                                                Extras: {extrasList.map(e => e.name || e.nombre).join(', ')}
                                                            </div>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                            </td>
                            <td>{solicitud.periodInMonths || solicitud.plazo} meses</td>
                            <td>
                                    <span className={`status-badge status-${estadoClase}`}>
                                        {solicitud.state || solicitud.estado || 'PENDING_ANALYST'}
                                    </span>
                            </td>
                            <td>
                                <div className="actions-cell">
                                    <button className="action-btn btn-aprobar" onClick={() => handleResolve(solicitud.id, 'APPROVED')}>
                                        Aprobar
                                    </button>
                                    <button className="action-btn btn-rechazar" onClick={() => handleResolve(solicitud.id, 'DENIED')}>
                                        Denegar
                                    </button>
                                    <button className="action-btn btn-garantias" onClick={() => handleResolve(solicitud.id, 'APPROVED_WITH_WARRANTIES')}>
                                        Garantías
                                    </button>
                                    <button className="action-btn btn-modificar" onClick={() => handleEditClick(solicitud)}>
                                        Modificar
                                    </button>
                                    <button className="action-btn btn-eliminar" onClick={() => deleteRequest(solicitud.id)}>
                                        Eliminar
                                    </button>
                                </div>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        );
    };

    return (
        <div className="list-request-container">
            <div className="request-header">
                <div>
                    <h1>Gestión de Solicitudes (Bandeja de Analista)</h1>
                    <p>Visualice el detalle de inversiones, compruebe riesgos y resuelva peticiones activas</p>
                </div>
                <button onClick={() => setMostrarFormulario(true)} className="btn-add">
                    Añadir Solicitud
                </button>
            </div>

            {renderContent()}

            <FormularioSolicitud
                open={mostrarFormulario}
                close={() => setMostrarFormulario(false)}
                onFormSubmit={handleFormSubmit}
            />

            {editingRequest && (
                <EditRequest
                    open={!!editingRequest}
                    close={() => setEditingRequest(null)}
                    requestEdit={editingRequest}
                    updateRequest={updateRequest}
                    onFormSubmit={handleFormSubmit}
                />
            )}
        </div>
    );
}