import { useParams, useNavigate } from "react-router-dom";
import { useCallback } from "react";
import useVehicles from "./useVehicles";
import { getOneVehicleById , getVehicleDetailWithExtras} from "../../services/vehiculoService";

import GenericCard from "../../components/GenericCard";

function VehicleDetail() {
  const params = useParams();
  const navigate = useNavigate();

  const apiFn = useCallback(() => {
    return getVehicleDetailWithExtras(params.id);
  }, [params.id]);

  const [vehicle, vehicleStatus, vehicleError] = useVehicles(apiFn);

  

  if (vehicleStatus === "loading") {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (vehicleStatus === "error") {
    return (
      <p>Ha ocurrido un error al cargar el vehículo: {vehicleError.message}</p>
    );
  }

  if (vehicleStatus === "success") {
    if (!vehicle) {
      return <p>Vehículo no encontrado</p>;
    }
    return (
      <div className="vehicle-detail-page">
        <GenericCard
          title={`${vehicle.brand} ${vehicle.model}`}
          subtitle="Vehículo disponible para renting"
        >
          <p className="vehicle-description">
            Consulta las características principales del vehículo, su precio, la
            cuota mensual base y las condiciones incluidas en el renting.
          </p>
        </GenericCard>

        <GenericCard
          title="Especificaciones técnicas"
          subtitle="Datos principales del vehículo"
        >
          <div className="vehicle-specs-grid">
            <div className="vehicle-spec-item">
              <span>Matrícula: </span>
              <strong>{vehicle.license_plate}</strong>
            </div>

            <div className="vehicle-spec-item">
              <span>Marca: </span>
              <strong>{vehicle.brand}</strong>
            </div>

            <div className="vehicle-spec-item">
              <span>Modelo: </span>
              <strong>{vehicle.model}</strong>
            </div>

            <div className="vehicle-spec-item">
              <span>Potencia: </span>
              <strong>{vehicle.potency} CV</strong>
            </div>

            <div className="vehicle-spec-item">
              <span>Cilindrada: </span>
              <strong>{vehicle.cc} cc</strong>
            </div>

            <div className="vehicle-spec-item">
              <span>Color: </span>
              <strong>{vehicle.color}</strong>
            </div>

            <div className="vehicle-spec-item">
              <span>Plazas: </span>
              <strong>{vehicle.spots}</strong>
            </div>

            <div className="vehicle-spec-item">
              <span>Disponibilidad: </span>
              <strong>{vehicle.available ? "Sí" : "No"}</strong>
            </div>
          </div>
        </GenericCard>

        <GenericCard
          title="Información económica"
          subtitle="Precio y cuota mensual base"
        >
          <div className="vehicle-price-grid">
            <div className="vehicle-price-card">
              <span>Precio del vehículo </span>
              <strong>{vehicle.price} €</strong>
            </div>

            <div className="vehicle-price-card vehicle-price-card-highlight">
              <span>Cuota mensual base </span>
              <strong>{vehicle.base_monthly_fee} € </strong>
              / mes
            </div>
          </div>
        </GenericCard>

        <GenericCard
          title="Servicios incluidos"
          subtitle="Condiciones básicas del renting"
        >
          <div className="vehicle-services-grid">
            <div className="vehicle-service-item">
              <span>IVA incluido </span>
              <strong>Sí</strong>
            </div>

            <div className="vehicle-service-item">
              <span>Mantenimiento </span>
              <strong>Incluido</strong>
            </div>

            <div className="vehicle-service-item">
              <span>Seguro </span>
              <strong>Incluido</strong>
            </div>

            <div className="vehicle-service-item">
              <span>Asistencia 24h</span>
              <strong>Incluida</strong>
            </div>
          </div>
        </GenericCard>

<GenericCard
          title="Extras disponibles"
          subtitle="Extras generales disponibles para todos los vehículos"
        >
          {!vehicle.extras || vehicle.extras.length === 0 ? (
            <p>No hay extras disponibles.</p>
          ) : (
            <div className="vehicle-extras-grid">
              {vehicle.extras.map((extra) => (
                <div className="vehicle-extra-item" key={extra.id}>
                  <div>
                    <strong>{extra.name}</strong>
                  </div>

                  <p>{formatExtraPrice(extra, vehicle)}</p>
                </div>
              ))}
            </div>
          )}
        </GenericCard>

        <div className="vehicle-actions">
          <button className="vehicle-primary-button">Solicitar Renting</button>

          <button
            className="vehicle-secondary-button"
            onClick={() => navigate(-1)}
          >
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }
}

function formatExtraPrice(extra, vehicle) {
  if (extra.price !== null && extra.price !== undefined) {
    return `${extra.price} €`;
  }

  if (extra.percentage !== null && extra.percentage !== undefined) {
    return `${extra.percentage}% =  ${Math.round(extra.percentage * 100) / 100 *  vehicle.price} €`;
  }

  return "Sin precio";
}

export default VehicleDetail;

