import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getSolicitudes, eliminarSolicitud, actualizarEstadoSolicitud } from '../../services/solicitudService';
import './ListadoSolicitudes.css';
import FormularioSolicitud from './FormularioSolicitud';
import TablaGenerica from '../../components/TablaGenerica/TablaGenerica';

export default function ListadoSolicitudes() {
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

    // Definimos la estructura de las columnas para nuestra tabla genérica
    const columns = useMemo(() => [
        { Header: 'ID', accessor: 'id' },
        { Header: 'DNI Cliente', accessor: 'clienteDni' },
        { Header: 'Vehículo', Cell: ({ row }) => `${row.original.vehiculo.marca} ${row.original.vehiculo.modelo}` },
        { Header: 'Plazo (meses)', accessor: 'plazo' },
        { Header: 'Estado', Cell: ({ row }) => <span className={`status-badge status-${row.original.estado.toLowerCase()}`}>{row.original.estado}</span> },
        { Header: 'Acciones', className: 'acciones-cell', Cell: ({ row }) => (
            <>
                <button className="action-btn btn-aprobar" onClick={() => handleActualizarEstado(row.original.id, 'APROBADA')}>Aprobar</button>
                <button className="action-btn btn-rechazar" onClick={() => handleActualizarEstado(row.original.id, 'DENEGADA')}>Rechazar</button>
                <button className="action-btn btn-garantias" onClick={() => handleActualizarEstado(row.original.id, 'APROBADA_CON_GARANTIAS')}>Aprob. con Garantías</button>
                <button className="action-btn btn-modificar">Modificar</button>
                <button className="action-btn btn-eliminar" onClick={() => handleEliminar(row.original.id)}>Eliminar</button>
            </>
        )},
    ], [handleActualizarEstado, handleEliminar]);

    return (
        <div className="listado-container">
            {mostrarFormulario ? (
                <FormularioSolicitud onFormSubmit={handleFormSubmit} onCancel={() => setMostrarFormulario(false)} />
            ) : (
                <>
                    <div className="listado-header">
                        <h2>Gestión de Solicitudes</h2>
                        <button className="btn-add" onClick={() => setMostrarFormulario(true)}>
                            Añadir Solicitud
                        </button>
                    </div>
                    <TablaGenerica
                        columns={columns}
                        data={solicitudes}
                        loading={loading}
                        error={error}
                        emptyMessage="No hay solicitudes para mostrar."
                    />
                </>
            )}
        </div>
    );
}