import React, { useEffect, useState } from "react";
import "./FormRequest.css";
import {
  getClientes,
  getVehiculos,
  getExtras,
} from "../../services/solicitudService";

export default function FormRequest({ open, close, saveRequest, onFormSubmit }) {
  const [formData, setFormData] = useState({
    customerId: "",
    periodInMonths: 12,
    vehicles: [
      {
        vehicleId: "",
        extraIds: [],
      },
    ],
  });

  const [clientes, setClientes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [extras, setExtras] = useState([]);

  const [loadingData, setLoadingData] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;

    async function loadData() {
      try {
        setLoadingData(true);
        setError(null);

        const [clientesData, vehiculosData, extrasData] = await Promise.all([
          getClientes(),
          getVehiculos(),
          getExtras(),
        ]);

        setClientes(clientesData);
        setVehiculos(vehiculosData);
        setExtras(extrasData);

        setFormData({
          customerId: "",
          periodInMonths: 12,
          vehicles: [
            {
              vehicleId: "",
              extraIds: [],
            },
          ],
        });
      } catch (err) {
        console.error("Error cargando datos del formulario:", err);
        setError("Error al cargar clientes, vehículos o extras.");
      } finally {
        setLoadingData(false);
      }
    }

    loadData();
  }, [open]);

  if (!open) return null;

  const handleCustomerChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      customerId: event.target.value,
    }));
  };

  const handlePeriodChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      periodInMonths: Number(event.target.value),
    }));
  };

  const handleVehicleChange = (index, value) => {
    setFormData((prev) => {
      const updatedVehicles = [...prev.vehicles];

      updatedVehicles[index] = {
        ...updatedVehicles[index],
        vehicleId: value,
        extraIds: [],
      };

      return {
        ...prev,
        vehicles: updatedVehicles,
      };
    });
  };

  const handleExtraChange = (vehicleIndex, extraId) => {
    setFormData((prev) => {
      const updatedVehicles = [...prev.vehicles];
      const currentVehicle = updatedVehicles[vehicleIndex];

      const currentExtras = currentVehicle.extraIds || [];

      const exists = currentExtras.some(
        (id) => String(id) === String(extraId)
      );

      const updatedExtras = exists
        ? currentExtras.filter((id) => String(id) !== String(extraId))
        : [...currentExtras, extraId];

      updatedVehicles[vehicleIndex] = {
        ...currentVehicle,
        extraIds: updatedExtras,
      };

      return {
        ...prev,
        vehicles: updatedVehicles,
      };
    });
  };

  const handleAddVehicle = () => {
    setFormData((prev) => ({
      ...prev,
      vehicles: [
        ...prev.vehicles,
        {
          vehicleId: "",
          extraIds: [],
        },
      ],
    }));
  };

  const handleRemoveVehicle = (index) => {
    setFormData((prev) => ({
      ...prev,
      vehicles: prev.vehicles.filter((_, i) => i !== index),
    }));
  };

  const getSelectedVehicle = (vehicleId) => {
    return vehiculos.find((vehicle) => String(vehicle.id) === String(vehicleId));
  };

  const getSelectedExtras = (extraIds) => {
    return extras.filter((extra) =>
      extraIds.some((id) => String(id) === String(extra.id))
    );
  };

  const calculateVehicleFee = (vehicle, selectedExtras = []) => {
    if (!vehicle) return 0;

    let fee = Number(vehicle.baseMonthlyFee || 0);
    const months = Number(formData.periodInMonths || 12);

    if (months < 12) {
      const monthsReduced = 12 - months;
      fee = fee * (1 + monthsReduced * 0.1);
    }

    if (months > 12) {
      const monthsIncreased = months - 12;
      const discount = Math.min(monthsIncreased * 0.03, 0.2);
      fee = fee * (1 - discount);
    }

    selectedExtras.forEach((extra) => {
      if (extra.price) {
        fee += Number(extra.price);
      }

      if (extra.percentage) {
        fee += fee * (Number(extra.percentage) / 100);
      }
    });

    return fee;
  };

  const calculateTotalFee = () => {
    return formData.vehicles.reduce((total, line) => {
      const vehicle = getSelectedVehicle(line.vehicleId);
      const selectedExtras = getSelectedExtras(line.extraIds || []);

      return total + calculateVehicleFee(vehicle, selectedExtras);
    }, 0);
  };

  const validateForm = () => {
    if (!formData.customerId) {
      setError("Debe seleccionar un cliente.");
      return false;
    }

    if (!formData.periodInMonths || formData.periodInMonths <= 0) {
      setError("Debe indicar un plazo válido.");
      return false;
    }

    const hasEmptyVehicle = formData.vehicles.some((line) => !line.vehicleId);

    if (hasEmptyVehicle) {
      setError("Todas las líneas deben tener un vehículo seleccionado.");
      return false;
    }

    return true;
  };

  const buildVehiclesForBackend = () => {
    const details = [];

    formData.vehicles.forEach((line) => {
      const vehicleId = Number(line.vehicleId);
      const extraIds = line.extraIds || [];

      if (extraIds.length === 0) {
        details.push({
          vehicleId,
          extraId: null,
        });
      } else {
        extraIds.forEach((extraId) => {
          details.push({
            vehicleId,
            extraId: Number(extraId),
          });
        });
      }
    });

    return details;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);
      setError(null);

      const dtoToSend = {
        customerId: Number(formData.customerId),
        periodInMonths: Number(formData.periodInMonths),
        vehicles: buildVehiclesForBackend(),
      };

      console.log("DTO enviado al backend:", dtoToSend);

      await saveRequest(dtoToSend);

      if (onFormSubmit) {
        await onFormSubmit();
      }

      close();
    } catch (err) {
      console.error("Error creando solicitud:", err);

      const backendMessage =
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message ||
            err.response?.data?.error ||
            "Error al crear la solicitud. Revisa que el cliente, vehículo y extras existan en backend.";

      setError(backendMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="Modal_Overlay">
      <div className="Modal_Request">
        <div className="Modal_Header">
          <div>
            <h2>Nueva Solicitud</h2>
            <p>Registra una solicitud de renting</p>
          </div>

          <button type="button" onClick={close}>
            X
          </button>
        </div>

        {loadingData ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label htmlFor="customerId">Cliente</label>
            <select
              id="customerId"
              value={formData.customerId}
              onChange={handleCustomerChange}
              required
            >
              <option value="">-- Seleccione un cliente --</option>

              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.name} {cliente.firstSurname || ""} - {cliente.nif}
                </option>
              ))}
            </select>

            <label htmlFor="periodInMonths">Plazo en meses</label>
            <input
              id="periodInMonths"
              type="number"
              min="1"
              max="60"
              value={formData.periodInMonths}
              onChange={handlePeriodChange}
              required
            />

            <div className="request-section-header">
              <h3>Vehículos</h3>

              <button
                type="button"
                className="btn-add"
                onClick={handleAddVehicle}
              >
                + Añadir vehículo
              </button>
            </div>

            {formData.vehicles.map((line, index) => {
              const selectedVehicle = getSelectedVehicle(line.vehicleId);
              const selectedExtras = getSelectedExtras(line.extraIds || []);
              const finalFee = calculateVehicleFee(
                selectedVehicle,
                selectedExtras
              );

              return (
                <div key={index} className="request-vehicle-card">
                  <div className="request-vehicle-card-header">
                    <strong>Vehículo #{index + 1}</strong>

                    {formData.vehicles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveVehicle(index)}
                        className="btn-remove-vehicle"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>

                  <label>Vehículo</label>
                  <select
                    value={line.vehicleId}
                    onChange={(event) =>
                      handleVehicleChange(index, event.target.value)
                    }
                    required
                  >
                    <option value="">-- Seleccione un vehículo --</option>

                    {vehiculos.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.licensePlate} - {vehicle.brand}{" "}
                        {vehicle.model} - {vehicle.price} €
                      </option>
                    ))}
                  </select>

                  {selectedVehicle && (
                    <div className="vehicle-info-box">
                      <p>
                        <strong>Color:</strong> {selectedVehicle.color}
                      </p>
                      <p>
                        <strong>Cuota base:</strong>{" "}
                        {selectedVehicle.baseMonthlyFee} €/mes
                      </p>
                    </div>
                  )}

                  <label>Extras</label>

                  {extras.length === 0 ? (
                    <p className="empty-extras-message">
                      No hay extras disponibles.
                    </p>
                  ) : (
                    <div className="extras-checkbox-list">
                      {extras.map((extra) => {
                        const checked = (line.extraIds || []).some(
                          (id) => String(id) === String(extra.id)
                        );

                        return (
                          <label
                            key={extra.id}
                            className="extra-checkbox-item"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() =>
                                handleExtraChange(index, extra.id)
                              }
                            />

                            <span>
                              {extra.name}
                              {extra.price
                                ? ` +${extra.price}€`
                                : extra.percentage
                                ? ` +${extra.percentage}%`
                                : ""}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {selectedExtras.length > 0 && (
                    <div className="selected-extras-box">
                      <strong>Extras seleccionados:</strong>
                      <ul>
                        {selectedExtras.map((extra) => (
                          <li key={extra.id}>
                            {extra.name}
                            {extra.price
                              ? ` +${extra.price}€`
                              : extra.percentage
                              ? ` +${extra.percentage}%`
                              : ""}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedVehicle && (
                    <p className="estimated-fee">
                      Cuota estimada: {finalFee.toFixed(2)} €/mes
                    </p>
                  )}
                </div>
              );
            })}

            <div className="total-fee-box">
              <strong>
                Cuota total estimada: {calculateTotalFee().toFixed(2)} €/mes
              </strong>
            </div>

            {error && <p className="error-message request-error">{error}</p>}

            <div className="Modal_Actions">
              <button type="button" onClick={close} disabled={saving}>
                Cancelar
              </button>

              <button type="submit" disabled={saving}>
                {saving ? "Guardando..." : "Crear solicitud"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}