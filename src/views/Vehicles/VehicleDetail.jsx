import { useParams, useNavigate } from "react-router-dom";
import { useCallback } from "react";
import useVehicles from "./useVehicles";
import { getOneVehicleById } from "../../services/vehiculoService";
import GenericTable from "../../components/GenericTable";
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
          title={`${vehicle.marca} ${vehicle.modelo}`}
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
              <strong>{vehicle.marca}</strong>
            </div>

            <div className="vehicle-spec-item">
              <span>Modelo</span>
              <strong>{vehicle.modelo}</strong>
            </div>

            <div className="vehicle-spec-item">
              <span>Potencia</span>
              <strong>{vehicle.potencia} CV</strong>
            </div>

            <div className="vehicle-spec-item">
              <span>Cilindrada</span>
              <strong>{vehicle.cilindrada} cc</strong>
            </div>

            <div className="vehicle-spec-item">
              <span>Color</span>
              <strong>{vehicle.color}</strong>
            </div>

            <div className="vehicle-spec-item">
              <span>Plazas</span>
              <strong>{vehicle.plazas}</strong>
            </div>

            <div className="vehicle-spec-item">
              <span>Disponibilidad</span>
              <strong>{vehicle.disponibilidad}</strong>
            </div>
          </div>
        </GenericCard>

      </div>
    );
  }
}
export default VehicleDetail;
