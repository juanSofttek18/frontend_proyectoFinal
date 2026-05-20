import { useState } from "react";
import { useClient } from "../../hooks/useClient";
import GenericTable from "../../components/GenericTable";
import GenericCard from "../../components/GenericCard";
import FormClient from "./FormClient";
import FormIngreso from "./FormIngreso";
import "./ListClient.css";

function ListClient() {
  const { clients = [], loading, error, search, setSearch, deleteClient, saveClient, saveClientIncome } = useClient();
  const [openForm, setOpenForm] = useState(false);
  const [clientEdit, setClientEdit] = useState(null);
  const [openIncomeForm, setOpenIncomeForm] = useState(false);
  const [clientForIncome, setClientForIncome] = useState(null);

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
    
    deleteClient(id);
    
  };

  const handleAddIngresoForm = (client) => {
    setClientForIncome(client);
    setOpenIncomeForm(true);
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

      {loading ? (
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
                placeholder="Buscar por nombre o NIF..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {clients.length === 0 ? (
            <div className="empty-message">No se encontraron clientes.</div>
          ) : (
            <GenericTable
              headers={["Cliente", "NIF", "Nacionalidad", "Tipo", "Contacto", "Scoring", "Estado", "Acciones"]}
            >
              {clients.map((client) => (
                <tr key={client.id}>
                  <td>{client.name} {client.firstSurname || ""} {client.secondSurname || ""}</td>
                  <td>{client.nif}</td>
                  <td>{client.nationality}</td>
                  <td>{client.employmentStatus === "EMPLOYED" ? "Trabajador" : "Autónomo"}</td>
                  <td>{client.phone}</td>
                  <td>{client.scoring != null ? Number(client.scoring).toFixed(1) : "0.0"} / 10</td>
                  <td>
                    <span className={`status-badge ${client.nonPayment === 0 ? "active" : "inactive"}`}>
                      {client.nonPayment === 0 ? "Al día" : "Impagos"}
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
                      <button className="btn-add-client" onClick={() => handleAddIngresoForm(client)}>
                        Añadir Ingreso
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

      <FormIngreso
        open={openIncomeForm}
        close={() => {
          setOpenIncomeForm(false);
          setClientForIncome(null);
        }}
        client={clientForIncome}
        saveIncome={async (clientId, ingreso) => {
          saveClientIncome(clientId, ingreso);
          setOpenIncomeForm(false);
          setClientForIncome(null);
        }}
      />
    </div>
  );
}

export default ListClient;