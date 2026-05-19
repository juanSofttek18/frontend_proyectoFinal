import React, { useState } from 'react';
import { useRequest } from '../../hooks/useRequest';
import FormularioSolicitud from './FormRequest';
import './ListRequest.css';

export default function ListRequest() {
    const { requests, loading, error, deleteRequest, updateRequestStatus, saveRequest } = useRequest();
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const handleFormSubmit = () => {
        setMostrarFormulario(false);
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
            return <div className="empty-message">No hay solicitudes para mostrar.</div>;
        }

        return (
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>DNI Cliente</th>
                        <th>Vehículo</th>
                        <th>Plazo (meses)</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map(solicitud => {
                        const marca = solicitud.vehiculo?.marca || solicitud.vehiculoMarca || '';
                        const modelo = solicitud.vehiculo?.modelo || solicitud.vehiculoModelo || '';
                        const vehiculoTexto = `${marca} ${modelo}`.trim() || 'No especificado';
                        const estadoClase = solicitud.estado ? solicitud.estado.toLowerCase() : 'pendiente';

                        return (
                            <tr key={solicitud.id}>
                                <td>{solicitud.id}</td>
                                <td>{solicitud.clienteDni || solicitud.dniCliente || 'N/A'}</td>
                                <td>{vehiculoTexto}</td>
                                <td>{solicitud.plazo}</td>
                                <td>
                                    <span className={`status-badge status-${estadoClase}`}>
                                        {solicitud.estado || 'PENDIENTE'}
                                    </span>
                                </td>
                                <td>
                                    <div className="actions-cell">
                                        <button className="action-btn btn-aprobar" onClick={() => updateRequestStatus(solicitud.id, 'APPROVED')}>
                                            Aprobar
                                        </button>
                                        <button className="action-btn btn-rechazar" onClick={() => updateRequestStatus(solicitud.id, 'REJECTED')}>
                                            Rechazar
                                        </button>
                                        <button className="action-btn btn-garantias" onClick={() => updateRequestStatus(solicitud.id, 'APPROVED_WITH_GUARANTEES')}>
                                            Garantías
                                        </button>
                                        <button className="action-btn btn-modificar">
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
                    <h1>Gestión de Solicitudes</h1>
                    <p>Administra y crea solicitudes</p>
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
                saveRequest={saveRequest}
            />
        </div>
    );
}