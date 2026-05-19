import { useParams, useNavigate} from "react-router-dom";
import { useCallback } from "react";
import useVehicles from "./useVehicles";
import { getAllAbleVehicles } from "../../services/vehiculoService";
import GenericTable from "../../components/GenericTable";
import "./VehicleCatalog.css";

function VehicleCatalog() {
  const params = useParams();
  const navigate = useNavigate();


  const apiFn = useCallback(() => {
    return getAllAbleVehicles(params.id);
  }, [params.id]);

  const [vehicles, vehiclesStatus, vehiclesError] = useVehicles(apiFn);

    function handleGoToDetail(vehicleId) {
    navigate(`/vehicles/${vehicleId}`);
  }

  if (vehiclesStatus === "loading") {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (vehiclesStatus === "error") {
    return (
      <p>
        Ha ocurrido un error al cargar los vehículos: {vehiclesError.message}
      </p>
    );
  }

  if (vehiclesStatus === "success") {
    if (!vehicles || vehicles.length === 0) {
      return <p>No hay vehículos disponibles</p>;
    }

    return (
      <GenericTable
        headers={[
          "Matrícula",
          "Marca",
          "Modelo",
          "Precio",
          "Cilindrada",
          "Potencia",
          "Color",
          "Plazas",
          "Cuota Mensual Base",
          "Disponibilidad",
          "Acciones",
        ]}
      >
        {vehicles.map((vehicle) => (
          <tr key={vehicle.id}>
            <td>{vehicle.license_plate}</td>
            <td>{vehicle.brand}</td>
            <td>{vehicle.model}</td>
            <td>{vehicle.price} €</td>
            <td>{vehicle.cc}</td>
            <td>{vehicle.potency}</td>
            <td>{vehicle.color}</td>
            <td>{vehicle.spots}</td>
            <td>{vehicle.base_monthly_fee} €</td>
            <td>{vehicle.available ? "Sí" : "No"}</td>
            <td>
              <button
                className="vehicle-detail-button"
                onClick={() => handleGoToDetail(vehicle.id)}
              >
                Ver detalle
              </button>
            </td>
          </tr>
        ))}
      </GenericTable>
    );
  }
}
export default VehicleCatalog;