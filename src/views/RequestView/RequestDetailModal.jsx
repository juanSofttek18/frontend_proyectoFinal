import React, { useEffect, useState } from "react";
import { getRequestDetail } from "../../services/solicitudService";
import "./RequestDetailModal.css";

export default function RequestDetailModal({ open, requestId, close }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState("idle");
  const [error, setError] = useState(null);

  const formatCurrency = (value) => {
    const num = Number(value);
    return Number.isNaN(num) ? "0.00 €" : `${num.toFixed(2)} €`;
  };

  const formatDate = (value) => {
    if (!value) return "Sin fecha";
    return new Date(value).toLocaleString();
  };

  const getEstadoTexto = (status) => {
    switch (status) {
      case "PENDING_ANALYST":
        return "Pendiente";
      case "APPROVED":
        return "Aprobada";
      case "DENIED":
        return "Denegada";
      case "APPROVED_WITH_WARRANTIES":
        return "Aprobada con garantías";
      default:
        return status || "Sin estado";
    }
  };

  useEffect(() => {
    if (!open || !requestId) return;

    async function loadDetail() {
      try {
        setLoading("loading");
        setError(null);

        const data = await getRequestDetail(requestId);
        setDetail(data);

        setLoading("success");
      } catch (err) {
        console.error("Error cargando detalle de solicitud:", err);
        setError("No se pudo cargar el detalle de la solicitud.");
        setLoading("error");
      }
    }

    loadDetail();
  }, [open, requestId]);

  if (!open) return null;

  return (
    <div className="request-detail-overlay">
      <div className="request-detail-modal">
        <div className="request-detail-header">
          <div>
            <h2>Detalle de solicitud #{requestId}</h2>
            <p>Información completa de la solicitud seleccionada</p>
          </div>

          <button type="button" className="request-detail-close" onClick={close}>
            X
          </button>
        </div>

        {loading === "loading" && (
          <div className="request-detail-loading">
            <div className="spinner"></div>
          </div>
        )}

        {loading === "error" && (
          <div className="request-detail-error">
            {error}
          </div>
        )}

        {loading === "success" && detail && (
          <>
            <section className="request-detail-section">
              <h3>Datos de la solicitud</h3>

              <div className="request-detail-grid">
                <div className="request-detail-field">
                  <span>ID solicitud</span>
                  <strong>{detail.requestId}</strong>
                </div>

                <div className="request-detail-field">
                  <span>Estado</span>
                  <strong>{getEstadoTexto(detail.state)}</strong>
                </div>

                <div className="request-detail-field">
                  <span>Plazo</span>
                  <strong>{detail.periodInMonths} meses</strong>
                </div>

                <div className="request-detail-field">
                  <span>Fecha creación</span>
                  <strong>{formatDate(detail.createdAt)}</strong>
                </div>

                <div className="request-detail-field">
                  <span>Fecha resolución</span>
                  <strong>{formatDate(detail.resolutionDate)}</strong>
                </div>
              </div>
            </section>

            <section className="request-detail-section">
              <h3>Cliente</h3>

              <div className="request-detail-grid">
                <div className="request-detail-field">
                  <span>ID cliente</span>
                  <strong>{detail.customerId}</strong>
                </div>

                <div className="request-detail-field">
                  <span>Nombre</span>
                  <strong>
                    {detail.customerName} {detail.customerFirstSurname || ""}{" "}
                    {detail.customerSecondSurname || ""}
                  </strong>
                </div>

                <div className="request-detail-field">
                  <span>NIF</span>
                  <strong>{detail.customerNif || "Sin NIF"}</strong>
                </div>
              </div>
            </section>

            <section className="request-detail-section">
              <h3>Vehículos</h3>

              {!detail.vehicles || detail.vehicles.length === 0 ? (
                <p className="request-detail-empty">
                  Esta solicitud no tiene vehículos asociados.
                </p>
              ) : (
                <div className="request-detail-vehicles">
                  {detail.vehicles.map((vehicle) => (
                    <div
                      key={vehicle.vehicleId}
                      className="request-detail-vehicle-card"
                    >
                      <div className="request-detail-vehicle-header">
                        <div>
                          <h4>
                            {vehicle.brand} {vehicle.model}
                          </h4>
                          <p>{vehicle.licensePlate || "Sin matrícula"}</p>
                        </div>

                        <span className="request-detail-vehicle-id">
                          ID {vehicle.vehicleId}
                        </span>
                      </div>

                      <div className="request-detail-grid">
                        <div className="request-detail-field">
                          <span>Precio</span>
                          <strong>{formatCurrency(vehicle.price)}</strong>
                        </div>

                        <div className="request-detail-field">
                          <span>Cuota base mensual</span>
                          <strong>{formatCurrency(vehicle.baseMonthlyFee)}</strong>
                        </div>
                      </div>

                      <div className="request-detail-extras">
                        <h5>Extras</h5>

                        {!vehicle.extras || vehicle.extras.length === 0 ? (
                          <p className="request-detail-empty">
                            Sin extras seleccionados.
                          </p>
                        ) : (
                          <ul>
                            {vehicle.extras.map((extra) => (
                              <li key={extra.id}>
                                <div>
                                  <strong>{extra.name}</strong>
                                  <span>{extra.category || "Sin categoría"}</span>
                                </div>

                                <div className="request-detail-extra-price">
                                  {extra.price != null &&
                                    formatCurrency(extra.price)}

                                  {extra.percentage != null &&
                                    ` + ${extra.percentage}%`}
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <div className="request-detail-actions">
              <button type="button" onClick={close}>
                Cerrar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}