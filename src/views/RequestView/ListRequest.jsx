import React, { useState, useEffect, useCallback } from 'react';
import { getSolicitudes, eliminarSolicitud, actualizarEstadoSolicitud } from '../../services/solicitudService';
import FormularioSolicitud from './FormRequest';
import './ListRequest.css';

export default function ListRequest() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const cargarSolicitudes = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getSolicitudes();
            setSolicitudes(data);
        } catch (err) {
            setError('Error al cargar las solicitudes. Por favor, inténtelo de nuevo.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        cargarSolicitudes();
    }, [cargarSolicitudes]);

    const handleEliminar = useCallback(async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta solicitud? Esta acción no se puede deshacer.')) {
            try {
                await eliminarSolicitud(id);
                setSolicitudes(prev => prev.filter(s => s.id !== id));
            } catch (err) {
                alert(`Error al eliminar la solicitud: ${err.message}`);
            }
        }
    }, []);

    const handleActualizarEstado = useCallback(async (id, nuevoEstado) => {
        try {
            const solicitudActualizada = await actualizarEstadoSolicitud(id, nuevoEstado);
            setSolicitudes(prev => prev.map(s => (s.id === id ? solicitudActualizada : s)));
        } catch (err) {
            alert(`Error al actualizar el estado: ${err.message}`);
        }
    }, []);

    const handleFormSubmit = useCallback(() => {
        setMostrarFormulario(false);
        cargarSolicitudes();
    }, [cargarSolicitudes]);

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

        if (solicitudes.length === 0) {
            return <div className="empty-message">No hay solicitudes para mostrar.</div>;
        }

        return (
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>DNI</th>
                        <th>Vehículo</th>
                        <th>Plazo (meses)</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {solicitudes.map(solicitud => (
                        <tr key={solicitud.id}>
                            <td>{solicitud.id}</td>
                            <td>{solicitud.clienteDni}</td>
                            <td>{`${solicitud.vehiculo?.marca || ''} ${solicitud.vehiculo?.modelo || ''}`}</td>
                            <td>{solicitud.plazo}</td>
                            <td>
                                <span className={`status-badge status-${solicitud.estado?.toLowerCase()}`}>
                                    {solicitud.estado}
                                </span>
                            </td>
                            <td>
                                <div className="actions-cell">
                                    <button className="action-btn btn-aprobar" onClick={() => handleActualizarEstado(solicitud.id, 'APROBADA')}>
                                        Aprobar
                                    </button>
                                    <button className="action-btn btn-rechazar" onClick={() => handleActualizarEstado(solicitud.id, 'DENEGADA')}>
                                        Rechazar
                                    </button>
                                    <button className="action-btn btn-garantias" onClick={() => handleActualizarEstado(solicitud.id, 'APROBADA_CON_GARANTIAS')}>
                                        Garantías
                                    </button>
                                    <button className="action-btn btn-modificar">
                                        Modificar
                                    </button>
                                    <button className="action-btn btn-eliminar" onClick={() => handleEliminar(solicitud.id)}>
                                        Eliminar
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
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
            />
        </div>
    );
}