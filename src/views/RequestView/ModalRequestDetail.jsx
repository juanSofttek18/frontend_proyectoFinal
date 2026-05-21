import "./ModalRequestDetail.css";

function ModalRequestDetail({ open, close, detail, loading, error }) {
  if (!open) return null;

  const formatDate = (date) => {
    if (!date) return "Sin resolver";
    return new Date(date).toLocaleString();
  };

  const formatMoney = (value) => {
    return `${Number(value || 0).toFixed(2)} €`;
  };

  const getCustomerFullName = () => {
    if (!detail?.customer) return "Cliente no disponible";

    return `${detail.customer.name || ""} ${
      detail.customer.firstSurname || ""
    } ${detail.customer.secondSurname || ""}`.trim();
  };

  const getStatusText = (status) => {
    if (status === "PENDING_ANALYST") return "Pendiente de analista";
    if (status === "APPROVED") return "Aprobada";
    if (status === "DENIED") return "Denegada";
    if (status === "APPROVED_WITH_WARRANTIES") {
      return "Aprobada con garantías";
    }

    return status || "Sin estado";
  };

  const getExtraPriceText = (extra) => {
    if (extra.price) {
      return ` +${Number(extra.price).toFixed(2)} €/mes`;
    }

    if (extra.percentage) {
      return ` +${Number(extra.percentage).toFixed(2)}%`;
    }

    return "";
  };

  const renderExtras = (vehicle) => {
    if (!vehicle.extras || vehicle.extras.length === 0) {
      return <p>Sin extras.</p>;
    }

    return (
      <ul>
        {vehicle.extras.map((extra) => (
          <li key={extra.id}>
            {extra.name}
            {getExtraPriceText(extra)}
          </li>
        ))}
      </ul>
    );
  };

  const renderVehicles = () => {
    if (!detail.vehicles || detail.vehicles.length === 0) {
      return <p>No hay vehículos asociados a esta solicitud.</p>;
    }

    return (
      <div className="detail-vehicles-list">
        {detail.vehicles.map((vehicle, index) => (
          <div
            key={`${vehicle.vehicleId}-${index}`}
            className="detail-vehicle-card"
          >
            <div className="detail-vehicle-header">
              <h4>
                {index + 1}. {vehicle.brand} {vehicle.model}
              </h4>

              <span>{vehicle.licensePlate}</span>
            </div>

            <div className="detail-grid">
              <p>
                <strong>Precio base:</strong> {formatMoney(vehicle.price)}
              </p>

              <p>
                <strong>Cuota base:</strong>{" "}
                {formatMoney(vehicle.baseMonthlyFee)} / mes
              </p>
            </div>

            <div className="detail-extras">
              <h5>Extras</h5>
              {renderExtras(vehicle)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderDetail = () => {
    return (
      <div className="request-detail-content">
        <section className="detail-section">
          <h3>Solicitud #{detail.id}</h3>

          <div className="detail-grid">
            <p>
              <strong>Estado:</strong> {getStatusText(detail.status)}
            </p>

            <p>
              <strong>Plazo:</strong> {detail.periodInMonths} meses
            </p>

            <p>
              <strong>Fecha creación:</strong> {formatDate(detail.createdAt)}
            </p>

            <p>
              <strong>Fecha resolución:</strong>{" "}
              {formatDate(detail.resolutionDate)}
            </p>
          </div>
        </section>

        <section className="detail-section">
          <h3>Cliente</h3>

          <div className="detail-grid">
            <p>
              <strong>Nombre:</strong> {getCustomerFullName()}
            </p>

            <p>
              <strong>NIF:</strong> {detail.customer?.nif || "Sin NIF"}
            </p>
          </div>
        </section>

        <section className="detail-section">
          <h3>Vehículos solicitados</h3>
          {renderVehicles()}
        </section>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="detail-loading">
          Cargando detalle de la solicitud...
        </div>
      );
    }

    if (error) {
      return <div className="detail-error">{error}</div>;
    }

    if (!detail) {
      return (
        <div className="detail-empty">
          No se encontró información de la solicitud.
        </div>
      );
    }

    return renderDetail();
  };

  return (
    <div className="Modal_Overlay">
      <div className="Modal_Request_Detail">
        <div className="Modal_Header">
          <div>
            <h2>Detalle de solicitud</h2>
            <p>Información completa de la solicitud seleccionada</p>
          </div>

          <button type="button" onClick={close}>
            X
          </button>
        </div>

        {renderContent()}

        <div className="Modal_Actions">
          <button type="button" onClick={close}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalRequestDetail;
