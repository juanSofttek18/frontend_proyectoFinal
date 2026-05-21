import React, { useEffect, useState } from "react";
import RequestVehicleCard from "./RequestVehicleCard";
import "./FormRequest.css";
import {
  getClientes,
  getVehiculos,
  getExtras,
  calculateVehiclePrice,
} from "../../services/solicitudService";

export default function FormRequest({
  open,
  close,
  saveRequest,
  onFormSubmit,
}) {
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
  const [priceResults, setPriceResults] = useState([]);

  const formatCurrency = (val) => {
    const num = Number(val);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

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

        resetForm();
      } catch (err) {
        console.error("Error cargando datos del formulario:", err);
        setError("Error al cargar clientes, vehículos o extras.");
      } finally {
        setLoadingData(false);
      }
    }

    loadData();
  }, [open]);

  useEffect(() => {
    let active = true;

    async function updateCalculations() {
      if (!formData.vehicles || formData.vehicles.length === 0) {
        setPriceResults([]);
        return;
      }

      try {
        const promises = formData.vehicles.map(async (line) => {
          if (!line.vehicleId || !formData.periodInMonths) {
            return null;
          }

          try {
            const data = await calculateVehiclePrice({
              vehicleId: Number(line.vehicleId),
              extraIds: (line.extraIds || []).map(Number),
              months: Number(formData.periodInMonths),
            });
            return data;
          } catch (err) {
            console.error("Error calculating vehicle price:", err);
            return null;
          }
        });

        const results = await Promise.all(promises);

        if (active) {
          setPriceResults(results);
        }
      } catch (err) {
        console.error("Error calculating vehicle prices:", err);
      }
    }

    updateCalculations();

    return () => {
      active = false;
    };
  }, [formData.vehicles, formData.periodInMonths]);

  const resetForm = () => {
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

    setError(null);
    setSaving(false);
    setPriceResults([]);
  };

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

  const handleExtraChange = (vehicleIndex, extra) => {
    setFormData((prev) => {
      const updatedVehicles = [...prev.vehicles];
      const currentVehicle = updatedVehicles[vehicleIndex];

      const currentExtraIds = currentVehicle.extraIds || [];

      const extrasSameCategory = extras
        .filter((item) => item.category === extra.category)
        .map((item) => item.id);

      const extraIdsWithoutSameCategory = currentExtraIds.filter(
        (id) =>
          !extrasSameCategory.some((extraId) => String(extraId) === String(id)),
      );

      updatedVehicles[vehicleIndex] = {
        ...currentVehicle,
        extraIds: [...extraIdsWithoutSameCategory, extra.id],
      };

      return {
        ...prev,
        vehicles: updatedVehicles,
      };
    });
  };

  const handleNoExtraForCategory = (vehicleIndex, category) => {
    setFormData((prev) => {
      const updatedVehicles = [...prev.vehicles];
      const currentVehicle = updatedVehicles[vehicleIndex];

      const currentExtraIds = currentVehicle.extraIds || [];

      const extrasSameCategory = extras
        .filter((item) => item.category === category)
        .map((item) => item.id);

      const updatedExtraIds = currentExtraIds.filter(
        (id) =>
          !extrasSameCategory.some((extraId) => String(extraId) === String(id)),
      );

      updatedVehicles[vehicleIndex] = {
        ...currentVehicle,
        extraIds: updatedExtraIds,
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

  const validateForm = () => {
    if (!formData.customerId) {
      setError("Debe seleccionar un cliente.");
      return false;
    }

    if (!formData.periodInMonths || formData.periodInMonths <= 0) {
      setError("Debe indicar un plazo válido.");
      return false;
    }

    if (formData.vehicles.length === 0) {
      setError("Debe añadir al menos un vehículo.");
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

  if (!open) return null;

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
                  {cliente.name} {cliente.firstSurname || ""}{" "}
                  {cliente.secondSurname || ""} - {cliente.nif}
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
              <h3>Vehículos solicitados</h3>

              <button
                type="button"
                className="btn-add"
                onClick={handleAddVehicle}
              >
                + Añadir vehículo
              </button>
            </div>

            {formData.vehicles.map((line, index) => (
              <RequestVehicleCard
                key={index}
                index={index}
                line={line}
                vehiculos={vehiculos}
                extras={extras}
                priceResult={priceResults[index]}
                periodInMonths={formData.periodInMonths}
                showRemoveButton={formData.vehicles.length > 1}
                onRemove={() => handleRemoveVehicle(index)}
                onVehicleChange={(val) => handleVehicleChange(index, val)}
                onExtraChange={(extra) => handleExtraChange(index, extra)}
                onNoExtraForCategory={(category) => handleNoExtraForCategory(index, category)}
              />
            ))}

            {priceResults.length > 0 && priceResults.some((res) => res) && (
              <div className="request-totals-summary">
                <h3>Resumen Total de la Solicitud</h3>
                <div className="total-row">
                  <span>Inversión Total:</span>
                  <span className="total-val">
                    {formatCurrency(
                      priceResults.reduce(
                        (acc, curr) =>
                          acc + (curr ? Number(curr.finalInvestment) : 0),
                        0,
                      ),
                    )}{" "}
                    €
                  </span>
                </div>
                <div className="total-row">
                  <span>Cuota Total Mensual:</span>
                  <span className="total-val">
                    {formatCurrency(
                      priceResults.reduce(
                        (acc, curr) =>
                          acc + (curr ? Number(curr.finalMonthlyFee) : 0),
                        0,
                      ),
                    )}{" "}
                    €/mes
                  </span>
                </div>
              </div>
            )}

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
