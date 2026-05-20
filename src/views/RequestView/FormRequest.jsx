import React, { useState, useEffect } from 'react';
import './FormRequest.css';
import {
    createRequest,
    getVehiculos,
    getExtras,
    getClientes
} from '../../services/solicitudService';
import { calcularResumenSolicitud } from '../../utils/calculadoraCuotas';

export default function FormRequest({ open, close, onFormSubmit }) {
    const [formData, setFormData] = useState({
        customerId: '',
        dniCliente: '',
        plazo: 12,
        vehicles: [{ vehicleId: '', color: '', extrasIds: [] }]
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [clientes, setClientes] = useState([]);
    const [vehiculos, setVehiculos] = useState([]);
    const [extras, setExtras] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [mostrarResumen, setMostrarResumen] = useState(false);

    useEffect(() => {
        if (open) {
            const loadInitialData = async () => {
                try {
                    setFetchError(null);
                    setIsDataLoading(true);
                    const [clientesData, vehiculosData, extrasData] = await Promise.all([
                        getClientes(),
                        getVehiculos(),
                        getExtras()
                    ]);
                    setClientes(clientesData);
                    setVehiculos(vehiculosData);
                    setExtras(extrasData);
                } catch (err) {
                    setFetchError('Error al cargar los datos reales del backend.');
                } finally {
                    setIsDataLoading(false);
                }
            };
            loadInitialData();

            setFormData({
                customerId: '',
                dniCliente: '',
                plazo: 12,
                vehicles: [{ vehicleId: '', color: '', extrasIds: [] }]
            });
            setError(null);
            setMostrarResumen(false);
        }
    }, [open]);

    const handleClienteChange = (e) => {
        const val = e.target.value;
        const matchingCliente = clientes.find(c => String(c.id) === String(val));
        setFormData(prev => ({
            ...prev,
            customerId: val,
            dniCliente: matchingCliente ? (matchingCliente.nif || matchingCliente.dniCliente || '') : ''
        }));
    };

    const handlePlazoChange = (e) => {
        setFormData(prev => ({ ...prev, plazo: Number(e.target.value) }));
    };

    const handleAddVehicleLine = () => {
        setFormData(prev => ({
            ...prev,
            vehicles: [...prev.vehicles, { vehicleId: '', color: '', extrasIds: [] }]
        }));
    };

    const handleRemoveVehicleLine = (index) => {
        setFormData(prev => ({
            ...prev,
            vehicles: prev.vehicles.filter((_, i) => i !== index)
        }));
    };

    const handleVehicleLineChange = (index, field, value) => {
        setFormData(prev => {
            const updatedVehicles = [...prev.vehicles];
            if (field === 'vehicleId') {
                updatedVehicles[index] = {
                    ...updatedVehicles[index],
                    vehicleId: value,
                    color: '',
                    extrasIds: []
                };
            } else {
                updatedVehicles[index] = {
                    ...updatedVehicles[index],
                    [field]: value
                };
            }
            return { ...prev, vehicles: updatedVehicles };
        });
    };

    const handleExtraCheckboxChange = (lineIndex, extraId, checked) => {
        setFormData(prev => {
            const updatedVehicles = [...prev.vehicles];
            const currentExtras = updatedVehicles[lineIndex].extrasIds;
            if (checked) {
                updatedVehicles[lineIndex].extrasIds = [...currentExtras, String(extraId)];
            } else {
                updatedVehicles[lineIndex].extrasIds = currentExtras.filter(id => String(id) !== String(extraId));
            }
            return { ...prev, vehicles: updatedVehicles };
        });
    };

    const handlePreSubmitCheck = (e) => {
        e.preventDefault();
        if (!formData.customerId || formData.vehicles.length === 0 || formData.vehicles.some(v => !v.vehicleId || !v.color) || formData.plazo <= 0) {
            setError("Por favor, complete todos los campos obligatorios y configure al menos un coche.");
            return;
        }
        setError(null);
        setMostrarResumen(true);
    };

    const handleFinalSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            const dtoToSend = {
                customerId: Number(formData.customerId),
                dni: formData.dniCliente,
                plazo: Number(formData.plazo),
                vehicles: formData.vehicles.map(v => ({
                    vehicleId: Number(v.vehicleId),
                    color: v.color,
                    extrasIds: v.extrasIds.map(Number)
                }))
            };
            await createRequest(dtoToSend);
            await onFormSubmit();
        } catch (err) {
            setError(err.message || "Error al registrar la solicitud.");
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    const lineasParaCalculo = formData.vehicles.map(v => {
        const matchingVehiculo = vehiculos.find(cat => String(cat.id) === String(v.vehicleId));
        const matchingExtras = extras.filter(cat => v.extrasIds.includes(String(cat.id)));
        return { vehiculo: matchingVehiculo, extras: matchingExtras };
    }).filter(l => l.vehiculo);

    const resumenFinanciero = calcularResumenSolicitud(lineasParaCalculo, formData.plazo);

    return (
        <div className="Modal_Overlay">
            <div className="Modal_Request">
                <div className="Modal_Header">
                    <div>
                        <h2>Formulario de Solicitud</h2>
                        <p>Genere una nueva solicitud de renting multivehículo con datos reales</p>
                    </div>
                    <button type="button" onClick={close}>X</button>
                </div>

                {fetchError && <p className="error-message">{fetchError}</p>}

                {!mostrarResumen ? (
                    <form onSubmit={handlePreSubmitCheck} noValidate>
                        <label htmlFor="form-customerId">Seleccione el Cliente</label>
                        <select
                            id="form-customerId"
                            value={formData.customerId}
                            onChange={handleClienteChange}
                            required
                            disabled={isDataLoading}
                        >
                            <option value="">{isDataLoading ? 'Cargando clientes...' : '-- Seleccione un Cliente --'}</option>
                            {clientes.map(c => (
                                <option key={c.id} value={c.id}>
                                    {`${c.name} ${c.first_surname || ''} (${c.nif || c.dniCliente || 'Sin NIF'})`}
                                </option>
                            ))}
                        </select>

                        <label htmlFor="form-plazo">Plazo del Contrato (meses)</label>
                        <input
                            type="number"
                            id="form-plazo"
                            value={formData.plazo}
                            onChange={handlePlazoChange}
                            min="6"
                            max="60"
                            required
                        />

                        <div style={{ margin: "1.5rem 0 0.5rem 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h3>Flota de Vehículos</h3>
                            <button
                                type="button"
                                onClick={handleAddVehicleLine}
                                className="btn-add"
                                style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}
                                disabled={isDataLoading}
                            >
                                + Añadir Vehículo
                            </button>
                        </div>

                        {formData.vehicles.map((linea, index) => {
                            const selectedVehiculo = vehiculos.find(v => String(v.id) === String(linea.vehicleId));
                            const extrasPermitidosIds = selectedVehiculo?.extrasPermitidos || [];
                            const extrasFiltrados = extras.filter(extra => extrasPermitidosIds.includes(extra.id));

                            return (
                                <div key={index} style={{ border: "1px solid #ddd", padding: "1rem", borderRadius: "6px", marginBottom: "1rem", backgroundColor: "#fafafa" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                                        <strong>Vehículo #{index + 1}</strong>
                                        {formData.vehicles.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveVehicleLine(index)}
                                                style={{ backgroundColor: "#dc3545", color: "white", border: "none", padding: "0.2rem 0.5rem", borderRadius: "4px", cursor: "pointer" }}
                                            >
                                                Eliminar
                                            </button>
                                        )}
                                    </div>

                                    <label>Vehículo de Catálogo</label>
                                    <select
                                        value={linea.vehicleId}
                                        onChange={(e) => handleVehicleLineChange(index, "vehicleId", e.target.value)}
                                        required
                                        disabled={isDataLoading}
                                    >
                                        <option value="">-- Seleccione un vehículo --</option>
                                        {vehiculos.map(v => (
                                            <option key={v.id} value={v.id}>
                                                {`${v.brand} - ${v.model} (Inversión Base: ${v.price}€)`}
                                            </option>
                                        ))}
                                    </select>

                                    <label>Color Disponible</label>
                                    <select
                                        value={linea.color}
                                        onChange={(e) => handleVehicleLineChange(index, "color", e.target.value)}
                                        disabled={!linea.vehicleId || isDataLoading}
                                        required
                                    >
                                        <option value="">-- Seleccione el color --</option>
                                        {selectedVehiculo && (
                                            <option value={selectedVehiculo.color}>{selectedVehiculo.color}</option>
                                        )}
                                    </select>

                                    <label style={{ marginTop: "0.5rem", display: "block" }}>Extras Disponibles para este Vehículo</label>
                                    <div className="checkbox-group" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", padding: "0.5rem 0" }}>
                                        {!linea.vehicleId ? (
                                            <p style={{ fontSize: "0.85rem", color: "#666", gridColumn: "1 / -1" }}>Seleccione primero un vehículo para filtrar sus extras.</p>
                                        ) : extrasFiltrados.length === 0 ? (
                                            <p style={{ fontSize: "0.85rem", color: "#666", gridColumn: "1 / -1" }}>Este vehículo no dispone de equipamiento extra de catálogo.</p>
                                        ) : (
                                            extrasFiltrados.map(extra => (
                                                <div key={extra.id} className="checkbox-item" style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                                    <input
                                                        type="checkbox"
                                                        id={`line-${index}-extra-${extra.id}`}
                                                        value={extra.id}
                                                        checked={linea.extrasIds.includes(String(extra.id))}
                                                        onChange={(e) => handleExtraCheckboxChange(index, extra.id, e.target.checked)}
                                                    />
                                                    <label htmlFor={`line-${index}-extra-${extra.id}`} style={{ fontSize: "0.85rem", fontWeight: "normal" }}>
                                                        {`${extra.name} (${extra.percentage ? `+${extra.percentage}%` : `+${extra.price}€`})`}
                                                    </label>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {error && <p className="error-message" style={{ color: '#dc3545', marginTop: '1rem', fontWeight: 'bold' }}>{error}</p>}

                        <div className="Modal_Actions">
                            <button type="button" onClick={close}>
                                Cancelar
                            </button>
                            <button type="submit" disabled={isDataLoading}>
                                Calcular y Ver Resumen
                            </button>
                        </div>
                    </form>
                ) : (
                    <div style={{ padding: "0.5rem 0" }}>
                        <h3 style={{ borderBottom: "2px solid #28a745", paddingBottom: "0.5rem", color: "#28a745" }}>Resumen Estructurado del Contrato</h3>

                        <div style={{ margin: "1rem 0", backgroundColor: "#f8f9fa", padding: "1rem", borderRadius: "6px" }}>
                            <p style={{ margin: "0.3rem 0" }}><strong>ID Cliente:</strong> {formData.customerId}</p>
                            <p style={{ margin: "0.3rem 0" }}><strong>DNI/NIF Registrado:</strong> {formData.dniCliente}</p>
                            <p style={{ margin: "0.3rem 0" }}><strong>Plazo del Renting:</strong> {resumenFinanciero.plazoMeses} meses</p>
                            <p style={{ margin: "0.3rem 0" }}><strong>Factor Plazo Aplicado:</strong> x{resumenFinanciero.factorPlazoAplicado.toFixed(2)}</p>
                        </div>

                        <h4>Desglose por Coche</h4>
                        <div style={{ maxHeight: "200px", overflowY: "auto", marginBottom: "1rem" }}>
                            {resumenFinanciero.vehicles.map((v, i) => (
                                <div key={i} style={{ borderLeft: "4px solid #007bff", paddingLeft: "0.8rem", margin: "0.5rem 0", backgroundColor: "#fff" }}>
                                    <p style={{ margin: "0.1rem 0" }}><strong>{v.brand} {v.model}</strong></p>
                                    <p style={{ margin: "0.1rem 0", fontSize: "0.85rem", color: "#666" }}>
                                        Cuota ajustada: {v.cuotaBaseAjustada.toFixed(2)}€ | Impacto extras: {v.costeExtras.toFixed(2)}€
                                    </p>
                                    <p style={{ margin: "0.1rem 0" }}>Cuota final de la línea: <strong>{v.cuotaFinal.toFixed(2)} €/mes</strong></p>
                                </div>
                            ))}
                        </div>

                        <div style={{ backgroundColor: "#e2e3e5", padding: "1rem", borderRadius: "6px", marginTop: "1rem" }}>
                            <p style={{ margin: "0.2rem 0", fontSize: "1rem" }}>Inversión Total Acumulada Catálogo: <strong>{resumenFinanciero.inversionTotal.toFixed(2)} €</strong></p>
                            <p style={{ margin: "0.2rem 0", fontSize: "1.2rem", color: "#155724" }}>Cuota Mensual Agrupada Final: <strong>{resumenFinanciero.cuotaMensualTotal.toFixed(2)} € / mes</strong></p>
                        </div>

                        {error && <p className="error-message" style={{ color: '#dc3545', marginTop: '1rem', fontWeight: 'bold' }}>{error}</p>}

                        <div className="Modal_Actions" style={{ marginTop: "1.5rem" }}>
                            <button type="button" onClick={() => setMostrarResumen(false)} disabled={loading}>
                                Modificar Configuración
                            </button>
                            <button type="button" onClick={handleFinalSubmit} style={{ backgroundColor: "#28a745", color: "#fff" }} disabled={loading}>
                                {loading ? 'Registrando...' : 'Confirmar y Enviar'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}