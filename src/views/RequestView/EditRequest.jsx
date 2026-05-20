import React, { useState, useEffect } from "react";
import { getVehiculos, getExtras } from "../../services/solicitudService";
import { calcularResumenSolicitud } from "../../utils/calculadoraCuotas";
import "./FormRequest.css";

export default function EditRequest({ open, close, onFormSubmit, updateRequest, requestEdit }) {
    const [formData, setFormData] = useState({
        id: "",
        dniCliente: "",
        customerId: "",
        plazo: 12,
        vehicles: []
    });

    const [catalogVehiculos, setCatalogVehiculos] = useState([]);
    const [catalogExtras, setCatalogExtras] = useState([]);
    const [loadingCatalog, setLoadingCatalog] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (open) {
            const loadCatalogData = async () => {
                try {
                    setLoadingCatalog(true);
                    const [vData, eData] = await Promise.all([getVehiculos(), getExtras()]);
                    setCatalogVehiculos(vData || []);
                    setCatalogExtras(eData || []);
                } catch (err) {
                    setError("Error al cargar el catálogo de datos reales.");
                } finally {
                    setLoadingCatalog(false);
                }
            };
            loadCatalogData();
        }
    }, [open]);

    useEffect(() => {
        if (requestEdit && catalogVehiculos.length > 0) {
            const lineasOriginales = requestEdit.vehicles || requestEdit.detalles || [];

            let mappedVehicles = lineasOriginales.map(linea => {
                const vId = linea.id_vehicle || linea.vehicleId || linea.vehiculo?.id;
                const listaExtras = linea.extras || [];
                return {
                    vehicleId: vId ? String(vId) : "",
                    color: linea.color || "",
                    extrasIds: listaExtras.map(e => String(e.id_extra || e.id))
                };
            });

            if (mappedVehicles.length === 0 && (requestEdit.vehiculoId || requestEdit.vehiculo?.id)) {
                const singleVId = requestEdit.vehiculo?.id || requestEdit.vehiculoId;
                mappedVehicles.push({
                    vehicleId: singleVId ? String(singleVId) : "",
                    color: requestEdit.color || "",
                    extrasIds: (requestEdit.extras || []).map(String)
                });
            }

            setFormData({
                id: requestEdit.id || "",
                dniCliente: requestEdit.clienteDni || requestEdit.dniCliente || "",
                customerId: requestEdit.customerId || "",
                plazo: Number(requestEdit.periodInMonths || requestEdit.plazo || 12),
                vehicles: mappedVehicles
            });
        }
    }, [requestEdit, catalogVehiculos]);

    if (!open) return null;

    const handlePlazoChange = (e) => {
        let val = Number(e.target.value);
        // Validadores estrictos en tiempo real frente a entradas absurdas
        if (val > 60) val = 60;
        setFormData(prev => ({ ...prev, plazo: val }));
    };

    const handleAddVehicleLine = () => {
        setFormData(prev => ({
            ...prev,
            vehicles: [...prev.vehicles, { vehicleId: "", color: "", extrasIds: [] }]
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
            if (field === "vehicleId") {
                updatedVehicles[index] = {
                    ...updatedVehicles[index],
                    vehicleId: value,
                    color: "",
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
            const currentExtras = updatedVehicles[lineIndex].extrasIds || [];
            if (checked) {
                updatedVehicles[lineIndex].extrasIds = [...currentExtras, String(extraId)];
            } else {
                updatedVehicles[lineIndex].extrasIds = currentExtras.filter(id => String(id) !== String(extraId));
            }
            return { ...prev, vehicles: updatedVehicles };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.plazo < 6 || formData.plazo > 60) {
            alert("El plazo debe establecerse estrictamente entre 6 y 60 meses.");
            return;
        }
        if (formData.vehicles.length === 0 || formData.vehicles.some(v => !v.vehicleId || !v.color)) {
            alert("Debe configurar correctamente al menos un vehículo con su respectivo color.");
            return;
        }
        try {
            const dtoToSend = {
                id: formData.id,
                customerId: formData.customerId,
                dniCliente: formData.dniCliente,
                periodInMonths: formData.plazo,
                vehicles: formData.vehicles.map(v => ({
                    vehicleId: Number(v.vehicleId),
                    color: v.color,
                    extrasIds: v.extrasIds.map(Number)
                }))
            };
            await updateRequest(formData.id, dtoToSend);
            onFormSubmit();
        } catch (err) {
            alert("Fallo al actualizar la solicitud.");
        }
    };

    const lineasParaCalculo = formData.vehicles.map(v => {
        const matchingVehiculo = catalogVehiculos.find(cat => String(cat.id) === String(v.vehicleId));
        const matchingExtras = catalogExtras.filter(cat => v.extrasIds.includes(String(cat.id)));
        return { vehiculo: matchingVehiculo, extras: matchingExtras };
    }).filter(l => l.vehiculo);

    const resumenFinanciero = calcularResumenSolicitud(lineasParaCalculo, formData.plazo);

    return (
        <div className="Modal_Overlay">
            <div className="Modal_Request">
                <div className="Modal_Header">
                    <div>
                        <h2>Modificar Solicitud #{formData.id}</h2>
                        <p>Cliente (DNI): {formData.dniCliente}</p>
                    </div>
                    <button type="button" onClick={close}>X</button>
                </div>

                {loadingCatalog ? (
                    <p style={{ padding: "1rem" }}>Cargando catálogo dinámico...</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {error && <p className="error-message">{error}</p>}

                        <label htmlFor="edit-plazo">Plazo de Financiación (meses: máx 60)</label>
                        <input
                            type="number"
                            id="edit-plazo"
                            value={formData.plazo}
                            onChange={handlePlazoChange}
                            min="6"
                            max="60"
                            required
                        />

                        <div style={{ margin: "1.5rem 0 0.5rem 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h3>Flota de Vehículos Solicitados</h3>
                            <button type="button" onClick={handleAddVehicleLine} className="btn-add" style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}>
                                + Añadir Otro Vehículo
                            </button>
                        </div>

                        {formData.vehicles.map((linea, index) => {
                            const selectedVehiculo = catalogVehiculos.find(v => String(v.id) === String(linea.vehicleId));
                            const extrasPermitidosIds = selectedVehiculo?.extrasPermitidos || [];
                            const extrasFiltrados = catalogExtras.filter(extra => extrasPermitidosIds.includes(extra.id));

                            return (
                                <div key={index} style={{ border: "1px solid #ddd", padding: "1rem", borderRadius: "6px", marginBottom: "1rem", backgroundColor: "#fafafa" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                                        <strong>Vehículo #{index + 1}</strong>
                                        {formData.vehicles.length > 1 && (
                                            <button type="button" onClick={() => handleRemoveVehicleLine(index)} style={{ backgroundColor: "#dc3545", color: "white", border: "none", padding: "0.2rem 0.5rem", borderRadius: "4px", cursor: "pointer" }}>
                                                Eliminar línea
                                            </button>
                                        )}
                                    </div>

                                    <label>Modelo del Vehículo</label>
                                    <select
                                        value={linea.vehicleId}
                                        onChange={(e) => handleVehicleLineChange(index, "vehicleId", e.target.value)}
                                        required
                                    >
                                        <option value="">-- Seleccione un vehículo real --</option>
                                        {catalogVehiculos.map(v => (
                                            <option key={v.id} value={v.id}>
                                                {`${v.brand} - ${v.model} (${v.price}€)`}
                                            </option>
                                        ))}
                                    </select>

                                    <label>Color</label>
                                    <select
                                        value={linea.color}
                                        onChange={(e) => handleVehicleLineChange(index, "color", e.target.value)}
                                        disabled={!linea.vehicleId}
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
                                            <p style={{ fontSize: "0.85rem", color: "#666", gridColumn: "1 / -1" }}>Seleccione primero un vehículo.</p>
                                        ) : extrasFiltrados.length === 0 ? (
                                            <p style={{ fontSize: "0.85rem", color: "#666", gridColumn: "1 / -1" }}>Sin equipamiento extra disponible.</p>
                                        ) : (
                                            extrasFiltrados.map(extra => (
                                                <div key={extra.id} className="checkbox-item" style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                                    <input
                                                        type="checkbox"
                                                        id={`edit-line-${index}-extra-${extra.id}`}
                                                        value={extra.id}
                                                        checked={(linea.extrasIds || []).includes(String(extra.id))}
                                                        onChange={(e) => handleExtraCheckboxChange(index, extra.id, e.target.checked)}
                                                    />
                                                    <label htmlFor={`edit-line-${index}-extra-${extra.id}`} style={{ fontSize: "0.85rem", fontWeight: "normal" }}>
                                                        {`${extra.name} (${extra.percentage ? `+${extra.percentage}%` : `+${extra.price}€`})`}
                                                    </label>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {resumenFinanciero && resumenFinanciero.vehicles && resumenFinanciero.vehicles.length > 0 && (
                            <div style={{ margin: "1.5rem 0", padding: "1rem", backgroundColor: "#e9ecef", borderRadius: "6px" }}>
                                <h4 style={{ margin: "0 0 0.5rem 0" }}>Cálculo de Cuota Corregido (Base Renting)</h4>
                                <p style={{ margin: "0.2rem 0" }}>Inversión Activo (Valor de Venta): <strong>{resumenFinanciero.inversionTotal.toFixed(2)} €</strong></p>
                                <p style={{ margin: "0.2rem 0" }}>Factor de Plazo Comercial: <strong>x{resumenFinanciero.factorPlazoAplicado.toFixed(2)}</strong></p>
                                <p style={{ margin: "0.4rem 0 0 0", fontSize: "1.1rem", color: "#28a745" }}>Cuota Mensual Total: <strong>{resumenFinanciero.cuotaMensualTotal.toFixed(2)} € / mes</strong></p>
                            </div>
                        )}

                        <div className="Modal_Actions">
                            <button type="button" onClick={close}>
                                Cancelar
                            </button>
                            <button type="submit">
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}