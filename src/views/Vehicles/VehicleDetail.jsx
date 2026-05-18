import { useParams, useNavigate } from "react-router-dom";
import { useCallback } from "react";
import useVehicles from "./useVehicles";
import { getOneVehicleById } from "../../services/vehiculoService";

import GenericCard from "../../components/GenericCard";

function VehicleDetail() {
  const params = useParams();
  const navigate = useNavigate();

  const apiFn = useCallback(() => {
    return getOneVehicleById(params.id);
  }, [params.id]);

  const [vehicle, vehicleStatus, vehicleError] = useVehicles(apiFn);

  if (vehicleStatus === "loading") {
    return <p>Cargando vehículo...</p>;
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
              <span>Matrícula</span>
              <strong>{vehicle.matricula}</strong>
            </div>

            <div className="vehicle-spec-item">
              <span>Marca</span>
              <strong>{vehicle.brand}</strong>
            </div>

            <div className="vehicle-spec-item">
              <span>Modelo</span>
              <strong>{vehicle.model}</strong>
            </div>

            <div className="vehicle-spec-item">
              <span>Potencia</span>
              <strong>{vehicle.potency} CV</strong>
            </div>

            <div className="vehicle-spec-item">
              <span>Cilindrada</span>
              <strong>{vehicle.cc} cc</strong>
            </div>

            <div className="vehicle-spec-item">
              <span>Color</span>
              <strong>{vehicle.color}</strong>
            </div>

            <div className="vehicle-spec-item">
              <span>Plazas</span>
              <strong>{vehicle.spots}</strong>
            </div>

            <div className="vehicle-spec-item">
              <span>Disponibilidad</span>
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
              <span>Precio del vehículo</span>
              <strong>{vehicle.price} €</strong>
            </div>

            <div className="vehicle-price-card vehicle-price-card-highlight">
              <span>Cuota mensual base</span>
              <strong>{vehicle.base_monthly_fee} €</strong>
              <p>/ mes</p>
            </div>
          </div>
        </GenericCard>

        <GenericCard
          title="Servicios incluidos"
          subtitle="Condiciones básicas del renting"
        >
          <div className="vehicle-services-grid">
            <div className="vehicle-service-item">
              <span>IVA incluido</span>
              <strong>Sí</strong>
            </div>

            <div className="vehicle-service-item">
              <span>Mantenimiento</span>
              <strong>Incluido</strong>
            </div>

            <div className="vehicle-service-item">
              <span>Seguro</span>
              <strong>Incluido</strong>
            </div>

            <div className="vehicle-service-item">
              <span>Asistencia 24h</span>
              <strong>Incluida</strong>
            </div>
          </div>
        </GenericCard>

        <GenericCard
          title="Equipamiento incluido"
          subtitle="Características adicionales"
        >
          <div className="vehicle-equipment-grid">
            <p>Sistema multimedia avanzado</p>
            <p>Climatizador automático</p>
            <p>Control de estabilidad</p>
            <p>Asistente de aparcamiento</p>
            <p>Faros LED</p>
            <p>Volante multifunción</p>
          </div>
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
export default VehicleDetail;
