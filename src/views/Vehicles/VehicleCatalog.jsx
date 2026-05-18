import { useParams } from "react-router-dom";
import { useCallback } from "react";
import useVehicles from "./useVehicles";
import { getAllAbleVehicles } from "../../services/vehiculoService";
import GenericTable from "../../components/GenericTable";

function VehicleCatalog() {
  const params = useParams();
  const apiFn = useCallback(() => {
    return getAllAbleVehicles(params.id);
  }, [params.id]);

  const [vehicles, vehiclesStatus, vehiclesError] = useVehicles(apiFn);

  if (vehiclesStatus === "loading") {
    return <p>Cargando vehículos...</p>;
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
        columns={[
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
        ]}
      >
        {vehicles.map((vehicle) => (
          <tr key={vehicle.id}>
            <td>{vehicle.matricula}</td>
            <td>{vehicle.marca}</td>
            <td>{vehicle.modelo}</td>
            <td>{vehicle.precio} €</td>
            <td>{vehicle.cilindrada}</td>
            <td>{vehicle.potencia}</td>
            <td>{vehicle.color}</td>
            <td>{vehicle.plazas}</td>
            <td>{vehicle.cuota_mensual_base} €</td>
            <td>{vehicle.disponibilidad}</td>
          </tr>
        ))}
      </GenericTable>
    );
  }
}
export default VehicleCatalog;
