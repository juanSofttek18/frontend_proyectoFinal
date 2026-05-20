import { useState } from "react";
import { useClient } from "../../hooks/useClientPrueba";
import GenericTable from "../../components/GenericTable";
import GenericCard from "../../components/GenericCard";
import FormClient from "./FormClient";
import "./ListClient.css";

function ListClient() {
  const { clients = [], loading, error, search, setSearch, deleteClient, saveClient } = useClient();
  const [openForm, setOpenForm] = useState(false);
  const [clientEdit, setClientEdit] = useState(null);

  const handleOpenCreateForm = () => {
    setClientEdit(null);
    setOpenForm(true);
  };

  const handleOpenEditForm = (client) => {
    setClientEdit(client);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setClientEdit(null);
  };

  const handleSave = async (client) => {
    await saveClient(client);
    handleCloseForm();
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      deleteClient(id);
    }
  };

  return (
    <div className="list-client-container">
      <div className="client-header">
        <div>
          <h1>Gestión de Clientes</h1>
          <p>Administra la información de tus clientes particulares y empresas</p>
        </div>
        <button className="btn-add-client" onClick={handleOpenCreateForm}>
          Agregar Cliente
        </button>
      </div>

      {loading === "loading" ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>Error al cargar los clientes: {error.message || "Error desconocido"}</p>
        </div>
      ) : (
        <GenericCard
          title="Base de Clientes"
          subtitle={`${clients.length} clientes registrados`}
        >
          <div className="client-filters">
            <input
              type="text"
              placeholder="Buscar por nombre o documento..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          {clients.length === 0 ? (
            <div className="empty-message">No se encontraron clientes.</div>
          ) : (
            <GenericTable
              headers={["Cliente", "Documento", "Tipo", "Contacto", "Scoring", "Estado", "Acciones"]}
            >
              {clients.map((client) => (
                <tr key={client.id}>
                  <td>{client.name} {client.first_surname || ""}</td>
                  <td>{client.nif}</td>
                  <td>{client.employment_status}</td>
                  <td>{client.phone}</td>
                  <td>{client.scoring}</td>
                  <td>
                    <span className={`status-badge ${client.is_active ? "active" : "inactive"}`}>
                      {client.is_active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button className="btn-edit-client" onClick={() => handleOpenEditForm(client)}>
                        Editar
                      </button>
                      <button className="btn-delete-client" onClick={() => handleDelete(client.id)}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </GenericTable>
          )}
        </GenericCard>
      )}

      <FormClient
        open={openForm}
        close={handleCloseForm}
        saveClient={handleSave}
        clientEdit={clientEdit}
      />
    </div>
  );
}

export default ListClient;