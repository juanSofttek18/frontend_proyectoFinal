import React, { useState } from "react";
import { useRequest } from "../../hooks/useRequest";
import FormRequest from "./FormRequest";
import "./ListRequest.css";

export default function ListRequest() {
  const {
    requests,
    loading,
    error,
    deleteRequest,
    updateRequestStatus,
    saveRequest,
    refetchRequests,
  } = useRequest();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [filtroActivo, setFiltroActivo] = useState("TODAS");

  const handleFormSubmit = async () => {
    setMostrarFormulario(false);
    await refetchRequests();
  };

  const handleResolve = async (id, status) => {
    const confirmacion = window.confirm(
        `¿Seguro que quieres cambiar la solicitud #${id} a ${status}?`
    );

    if (!confirmacion) return;

    await updateRequestStatus(id, status);
  };

  const getEstadoClase = (status) => {
    if (!status) return "pending";
    return status.toLowerCase().replaceAll("_", "-");
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

  const solicitudesFiltradas = requests.filter((solicitud) => {
    if (filtroActivo === "TODAS") return true;
    return solicitud.status === filtroActivo;
  });

  const renderContent = () => {
    if (loading === "loading") {
      return (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
      );
    }

    if (loading === "error") {
      return (
          <div className="error-message">
            {error || "Error al cargar las solicitudes"}
          </div>
      );
    }

    if (!requests || requests.length === 0) {
      return (
          <div className="empty-message">
            No hay solicitudes registradas en el sistema.
          </div>
      );
    }

    return (
        <>
          <div className="filters-container">
            <button
                className={`filter-btn ${filtroActivo === "TODAS" ? "active" : ""}`}
                onClick={() => setFiltroActivo("TODAS")}
            >
              Todas
            </button>
            <button
                className={`filter-btn ${
                    filtroActivo === "PENDING_ANALYST" ? "active" : ""
                }`}
                onClick={() => setFiltroActivo("PENDING_ANALYST")}
            >
              Pendientes
            </button>
            <button
                className={`filter-btn ${
                    filtroActivo === "APPROVED" ? "active" : ""
                }`}
                onClick={() => setFiltroActivo("APPROVED")}
            >
              Aprobadas
            </button>
            <button
                className={`filter-btn ${
                    filtroActivo === "DENIED" ? "active" : ""
                }`}
                onClick={() => setFiltroActivo("DENIED")}
            >
              Denegadas
            </button>
            <button
                className={`filter-btn ${
                    filtroActivo === "APPROVED_WITH_WARRANTIES" ? "active" : ""
                }`}
                onClick={() => setFiltroActivo("APPROVED_WITH_WARRANTIES")}
            >
              Con Garantías
            </button>
          </div>

          {solicitudesFiltradas.length === 0 ? (
              <div className="empty-message">
                No hay solicitudes que coincidan con este filtro.
              </div>
          ) : (
              <table>
                <thead>
                <tr>
                  <th>ID</th>
                  <th>ID Cliente</th>
                  <th>Plazo</th>
                  <th>Estado</th>
                  <th>Fecha creación</th>
                  <th>Fecha resolución</th>
                  <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {solicitudesFiltradas.map((solicitud) => (
                    <tr key={solicitud.id}>
                      <td>{solicitud.id}</td>
                      <td>{solicitud.customerId}</td>
                      <td>{solicitud.periodInMonths} meses</td>
                      <td>
                    <span
                        className={`status-badge status-${getEstadoClase(
                            solicitud.status
                        )}`}
                    >
                      {getEstadoTexto(solicitud.status)}
                    </span>
                      </td>
                      <td>
                        {solicitud.createdAt
                            ? new Date(solicitud.createdAt).toLocaleString()
                            : "Sin fecha"}
                      </td>
                      <td>
                        {solicitud.resolutionDate
                            ? new Date(solicitud.resolutionDate).toLocaleString()
                            : "Sin resolver"}
                      </td>
                      <td>
                        <div className="actions-cell">
                          {solicitud.status === "PENDING_ANALYST" && (
                              <>
                                <button
                                    className="action-btn btn-aprobar"
                                    onClick={() =>
                                        handleResolve(solicitud.id, "APPROVED")
                                    }
                                >
                                  Aprobar
                                </button>
                                <button
                                    className="action-btn btn-rechazar"
                                    onClick={() =>
                                        handleResolve(solicitud.id, "DENIED")
                                    }
                                >
                                  Denegar
                                </button>
                                <button
                                    className="action-btn btn-garantias"
                                    onClick={() =>
                                        handleResolve(
                                            solicitud.id,
                                            "APPROVED_WITH_WARRANTIES"
                                        )
                                    }
                                >
                                  Garantías
                                </button>
                              </>
                          )}
                          {solicitud.status === "DENIED" && (
                              <button
                                  className="action-btn btn-eliminar"
                                  onClick={() => deleteRequest(solicitud.id)}
                              >
                                Eliminar
                              </button>
                          )}
                        </div>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
          )}
        </>
    );
  };

  return (
      <div className="list-request-container">
        <div className="request-header">
          <div>
            <h1>Gestión de Solicitudes</h1>
            <p>Consulta, crea y gestiona todas las solicitudes del sistema</p>
          </div>
          <button onClick={() => setMostrarFormulario(true)} className="btn-add">
            Añadir Solicitud
          </button>
        </div>
        {renderContent()}
        <FormRequest
            open={mostrarFormulario}
            close={() => setMostrarFormulario(false)}
            saveRequest={saveRequest}
            onFormSubmit={handleFormSubmit}
        />
      </div>
  );
}