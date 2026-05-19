import { useParams, useNavigate } from "react-router-dom";
import { useCallback } from "react";
import useVehicles from "./useVehicles";
import { getAllAbleVehicles } from "../../services/vehiculoService";
import GenericTable from "../../components/GenericTable";
import GenericCard from "../../components/GenericCard";
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

    const renderContent = () => {
        if (vehiclesStatus === "loading") {
            return (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                </div>
            );
        }

        if (vehiclesStatus === "error") {
            return (
                <div className="error-message">
                    Error al cargar los vehículos: {vehiclesError.message}
                </div>
            );
        }

        if (!vehicles || vehicles.length === 0) {
            return <div className="empty-message">No hay vehículos disponibles</div>;
        }

        return (
            <GenericCard
                title="Catálogo Disponible"
                subtitle={`${vehicles.length} vehículos encontrados`}
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
                            <td>{vehicle.cc} cc</td>
                            <td>{vehicle.potency} CV</td>
                            <td>{vehicle.color}</td>
                            <td>{vehicle.spots}</td>
                            <td>{vehicle.base_monthly_fee} €</td>
                            <td>
                <span
                    className={`status-badge ${
                        vehicle.available ? "status-aprobada" : "status-denegada"
                    }`}
                >
                  {vehicle.available ? "Sí" : "No"}
                </span>
                            </td>
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