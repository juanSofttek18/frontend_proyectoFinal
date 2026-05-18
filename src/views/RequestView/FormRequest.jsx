import React, { useState, useEffect } from 'react';
import './FormRequest.css';
import { enviarSolicitud, getVehiculos, getExtras } from '../../services/solicitudService';

export default function FormRequest({ onFormSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        dni: '',
        vehiculoId: '',
        color: '',
        extras: [],
        plazo: 12,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [vehiculos, setVehiculos] = useState([]);
    const [extras, setExtras] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setFetchError(null);
                setIsDataLoading(true);
                const [vehiculosData, extrasData] = await Promise.all([
                    getVehiculos(),
                    getExtras()
                ]);
                setVehiculos(vehiculosData);
                setExtras(extrasData);
            } catch (err) {
                setFetchError('Error al cargar los datos. Por favor, recargue la página.');
            } finally {
                setIsDataLoading(false);
            }
        };
        loadInitialData();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            const extraId = value;
            setFormData(prevState => {
                const newExtras = checked
                    ? [...prevState.extras, extraId]
                    : prevState.extras.filter(id => String(id) !== String(extraId));
                return { ...prevState, extras: newExtras };
            });
        } else if (name === 'vehiculoId') {
            setFormData(prevState => ({
                ...prevState,
                [name]: value,
                color: '' // Resetea el color si cambia el vehículo
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.dni || !formData.vehiculoId || !formData.color || formData.plazo <= 0) {
            setError("Por favor, complete todos los campos obligatorios.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await enviarSolicitud(formData);
            onFormSubmit();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const selectedVehiculo = vehiculos.find(v => String(v.id) === formData.vehiculoId);

    return (
        <div className="form-container">
            <h2>Formulario de Solicitud</h2>
            {fetchError && <p className="error-message">{fetchError}</p>}
            <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                    <label htmlFor="dni">DNI del Cliente</label>
                    <input type="text" id="dni" name="dni" value={formData.dni} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="vehiculoId">Vehículo</label>
                    <select id="vehiculoId" name="vehiculoId" value={formData.vehiculoId} onChange={handleChange} required disabled={isDataLoading}>
                        <option value="">{isDataLoading ? 'Cargando vehículos...' : '-- Seleccione un vehículo --'}</option>
                        {vehiculos.map((vehiculo) => (
                            <option key={vehiculo.id} value={vehiculo.id}>
                                {`${vehiculo.marca} - ${vehiculo.modelo} (Inversión: ${vehiculo.precio}€)`}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="color">Color del Vehículo</label>
                    <select
                        id="color"
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        required
                        disabled={!formData.vehiculoId || isDataLoading}
                    >
                        <option value="">
                            {!formData.vehiculoId ? '-- Primero seleccione un vehículo --' : '-- Seleccione un color --'}
                        </option>
                        {selectedVehiculo && selectedVehiculo.coloresDisponibles && selectedVehiculo.coloresDisponibles.map((color) => (
                            <option key={color} value={color}>{color}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Extras</label>
                    <div className="checkbox-group">
                        {extras.map((extra) => (
                            <div key={extra.id} className="checkbox-item">
                                <input
                                    type="checkbox"
                                    id={`extra-${extra.id}`}
                                    value={extra.id}
                                    checked={formData.extras.map(String).includes(String(extra.id))}
                                    onChange={handleChange}
                                />
                                <label htmlFor={`extra-${extra.id}`}>
                                    {`${extra.nombre} (${extra.tipoAumento === 'PORCENTUAL' ? `+${extra.valor}%` : `+${extra.valor}€`})`}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="plazo">Plazo del Contrato (meses)</label>
                    <input type="number" id="plazo" name="plazo" value={formData.plazo} onChange={handleChange} min="6" max="60" required />
                </div>

                {error && <p className="error-message">{error}</p>}

                <div className="form-actions">
                    <button type="button" className="cancel-btn" onClick={onCancel} disabled={loading}>
                        Cancelar
                    </button>
                    <button type="submit" className="submit-btn" disabled={loading || isDataLoading}>
                        {loading ? 'Enviando...' : 'Enviar Solicitud'}
                    </button>
                </div>
            </form>
        </div>
    );
}