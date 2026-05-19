import React, {useState, useEffect, useCallback} from 'react';
import {getSolicitudes, eliminarSolicitud, actualizarEstadoSolicitud} from '../../services/solicitudService';
import './ListRequest.css';
import FormularioSolicitud from './FormRequest';

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
                setSolicitudes(prevSolicitudes => prevSolicitudes.filter(s => s.id !== id));
            } catch (err) {
                alert(`Error al eliminar la solicitud: ${err.message}`);
            }
        }
    }, []);

    const handleActualizarEstado = useCallback(async (id, nuevoEstado) => {
        try {
            const solicitudActualizada = await actualizarEstadoSolicitud(id, nuevoEstado);
            setSolicitudes(prevSolicitudes =>
                prevSolicitudes.map(s => (s.id === id ? solicitudActualizada : s))
            );
        } catch (err) {
            alert(`Error al actualizar el estado: ${err.message}`);
        }
    }, []);

    const handleFormSubmit = useCallback(() => {
        setMostrarFormulario(false);
        cargarSolicitudes();
    }, [cargarSolicitudes]);

    const renderTablaSolicitudes = () => {

        if (solicitudes.length === 0) {
            return <div className="empty-message">No hay solicitudes para mostrar.</div>;
        }

        return (
            <div className="tabla-wrapper">
                <table className="tabla-solicitudes">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>DNI Cliente</th>
                        <th>Vehículo</th>
                        <th>Plazo (meses)</th>
                        <th>Estado</th>
                        <th className="acciones-cell">Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {solicitudes.map(solicitud => (
                        <tr key={solicitud.id}>
                            <td>{solicitud.id}</td>
                            <td>{solicitud.clienteDni}</td>
                            <td>{`${solicitud.vehiculo.marca} ${solicitud.vehiculo.modelo}`}</td>
                            <td>{solicitud.plazo}</td>
                            <td>
                                <span
                                    className={`status-badge status-${solicitud.estado.toLowerCase()}`}>{solicitud.estado}</span>
                            </td>
                            <td className="acciones-cell">
                                <button className="action-btn btn-aprobar"
                                        onClick={() => handleActualizarEstado(solicitud.id, 'APROBADA')}>Aprobar
                                </button>
                                <button className="action-btn btn-rechazar"
                                        onClick={() => handleActualizarEstado(solicitud.id, 'DENEGADA')}>Rechazar
                                </button>
                                <button className="action-btn btn-garantias"
                                        onClick={() => handleActualizarEstado(solicitud.id, 'APROBADA_CON_GARANTIAS')}>Aprob.
                                    con Garantías
                                </button>
                                <button className="action-btn btn-modificar">Modificar</button>
                                <button className="action-btn btn-eliminar"
                                        onClick={() => handleEliminar(solicitud.id)}>Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    };

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

    return (
        <div className="listado-container">
            {mostrarFormulario ? (
                <FormularioSolicitud onFormSubmit={handleFormSubmit} onCancel={() => setMostrarFormulario(false)}/>
            ) : (
                <>
                    <div className="listado-header">
                        <div>
                            <h1>Gestión de Solicitudes</h1>
                            <p>Administra y crea solicitudes</p>
                        </div>
                        <button className="btn-add">Añadir Solicitud</button>
                    </div>
                    {renderTablaSolicitudes()}
                </>
            )}
        </div>
    );
}