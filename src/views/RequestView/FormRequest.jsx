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
        extraId: "",
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
              extraId: "",
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

  const handleVehicleChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedVehicles = [...prev.vehicles];

      updatedVehicles[index] = {
        ...updatedVehicles[index],
        [field]: value,
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
          extraId: "",
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

  const calculateVehicleFee = (vehicle, extra) => {
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

    if (extra) {
      if (extra.price) {
        fee += Number(extra.price);
      }

      if (extra.percentage) {
        fee += fee * (Number(extra.percentage) / 100);
      }
    }

    return fee;
  };

  const calculateTotalFee = () => {
    return formData.vehicles.reduce((total, line) => {
      const vehicle = getSelectedVehicle(line.vehicleId);
      const extra = extras.find((e) => String(e.id) === String(line.extraId));

      return total + calculateVehicleFee(vehicle, extra);
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);
      setError(null);

      const dtoToSend = {
        customerId: Number(formData.customerId),
        periodInMonths: Number(formData.periodInMonths),
        vehicles: formData.vehicles.map((line) => ({
          vehicleId: Number(line.vehicleId),
          extraId: line.extraId ? Number(line.extraId) : null,
        })),
      };

      console.log("DTO enviado al backend:", dtoToSend);

      await saveRequest(dtoToSend);

      if (onFormSubmit) {
        await onFormSubmit();
      }

      close();
    } catch (err) {
      console.error("Error creando solicitud:", err);
      setError(
        "Error al crear la solicitud. Revisa que el cliente, vehículo y extra existan en backend."
      );
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

            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
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
              const selectedExtra = extras.find(
                (extra) => String(extra.id) === String(line.extraId)
              );

              const finalFee = calculateVehicleFee(
                selectedVehicle,
                selectedExtra
              );

              return (
                <div
                  key={index}
                  style={{
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                    padding: "1rem",
                    marginTop: "1rem",
                    background: "#F7FAFA",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <strong>Vehículo #{index + 1}</strong>

                    {formData.vehicles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveVehicle(index)}
                        style={{
                          background: "#dc3545",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          padding: "6px 10px",
                          cursor: "pointer",
                        }}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>

                  <label>Vehículo</label>
                  <select
                    value={line.vehicleId}
                    onChange={(event) =>
                      handleVehicleChange(
                        index,
                        "vehicleId",
                        event.target.value
                      )
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
                    <div
                      style={{
                        marginTop: "0.8rem",
                        fontSize: "0.9rem",
                        color: "#4A5568",
                      }}
                    >
                      <p>
                        <strong>Color:</strong> {selectedVehicle.color}
                      </p>
                      <p>
                        <strong>Cuota base:</strong>{" "}
                        {selectedVehicle.baseMonthlyFee} €/mes
                      </p>
                    </div>
                  )}

                  <label>Extra</label>
                  <select
                    value={line.extraId}
                    onChange={(event) =>
                      handleVehicleChange(index, "extraId", event.target.value)
                    }
                  >
                    <option value="">Sin extra</option>

                    {extras.map((extra) => (
                      <option key={extra.id} value={extra.id}>
                        {extra.name}
                        {extra.price
                          ? ` +${extra.price}€`
                          : extra.percentage
                          ? ` +${extra.percentage}%`
                          : ""}
                      </option>
                    ))}
                  </select>

                  {selectedVehicle && (
                    <p
                      style={{
                        marginTop: "0.8rem",
                        fontWeight: "bold",
                        color: "#1A365D",
                      }}
                    >
                      Cuota estimada: {finalFee.toFixed(2)} €/mes
                    </p>
                  )}
                </div>
              );
            })}

            <div
              style={{
                marginTop: "1rem",
                padding: "1rem",
                background: "#E2E8F0",
                borderRadius: "8px",
                color: "#1A365D",
              }}
            >
              <strong>
                Cuota total estimada: {calculateTotalFee().toFixed(2)} €/mes
              </strong>
            </div>

            {error && (
              <p
                className="error-message"
                style={{
                  marginTop: "1rem",
                }}
              >
                {error}
              </p>
            )}

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