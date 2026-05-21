import { useParams, useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import useVehicles from "../../hooks/useVehicles";
import { getAllAbleVehicles } from "../../services/vehiculoService";
import GenericTable from "../../components/GenericTable";
import GenericCard from "../../components/GenericCard";
import Pagination from "../../components/Pagination";
import "./VehicleCatalog.css";

function VehicleCatalog() {
  const params = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);

  const apiFn = useCallback(() => {
    return getAllAbleVehicles(params.id);
  }, [params.id]);

  const [vehicles, vehiclesStatus, vehiclesError] = useVehicles(apiFn);

  function handleGoToDetail(vehicleId) {
    navigate(`/vehicles/${vehicleId}`);
  }

  const renderContent = () => {
    if (!vehicles || vehicles.length === 0) {
      return <div className="empty-message">No hay vehículos disponibles</div>;
    }

    const availableVehicles = vehicles.filter(
      (vehicle) => vehicle.available === true || vehicle.available === 1,
    );

    if (availableVehicles.length === 0) {
      return <div className="empty-message">No hay vehículos disponibles</div>;
    }

    const itemsPerPage = 10;
    const totalPages = Math.ceil(availableVehicles.length / itemsPerPage);
    const activePage = currentPage >= totalPages ? Math.max(0, totalPages - 1) : currentPage;
    const vehiclesPaginados = availableVehicles.slice(
      activePage * itemsPerPage,
      (activePage + 1) * itemsPerPage
    );

    return (
      <GenericCard
        title="Catálogo Disponible"
        subtitle={`${availableVehicles.length} vehículos encontrados`}
      >
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
            "Acciones",
          ]}
        >
          {vehiclesPaginados.map((vehicle) => (
            <tr key={vehicle.id}>
              <td>{vehicle.licensePlate}</td>
              <td>{vehicle.brand}</td>
              <td>{vehicle.model}</td>
              <td>{vehicle.price} €</td>
              <td>{vehicle.cc} cc</td>
              <td>{vehicle.potency} CV</td>
              <td>{vehicle.color}</td>
              <td>{vehicle.spots}</td>
              <td>{vehicle.baseMonthlyFee} €</td>
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
        <Pagination
          currentPage={activePage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </GenericCard>
    );
  };

  return (
    <div className="catalog-container">
      <div className="catalog-header">
        <div>
          <h1>Catálogo de Vehículos</h1>
          <p>Consulta y selecciona los vehículos disponibles para renting</p>
        </div>
      </div>
      {renderContent()}
    </div>
  );
}

export default VehicleCatalog;
