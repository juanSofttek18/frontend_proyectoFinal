import { useClient } from "./useClientPrueba";
import GenericTable from "../../components/GenericTable"; 
import GenericCard from "../../components/GenericCard";
import "./Client.css";
import FormClient from "./FormClient";
import { useState } from "react";
 
function ListClient() {
  const { clients, loading, error, search, setSearch, deleteClient,saveClient,} = useClient();
  const [openForm, setOpenForm] = useState(false);
  const [clientEdit, setClientEdit] = useState(null);

  const handleSave = (client) => {
    saveClient(client);
    setOpenForm(false);
    setClientEdit(null);
  };
 
  if (loading) return <p>Loading clients data...</p>;
  if (error) return <p>Error: {error.message}</p>;
 
  return (
<div className="List_Client">
<div className="Header_Client">
<div>
<h1>Gestión de Clientes</h1>
<p>Administra la información de tus clientes particulares y empresas</p>
</div>
<button className="Add_Client" onClick={() => {
  setClientEdit(null);
  setOpenForm(true);
}}>
  Agregar Cliente
</button>
</div>
 
      
<GenericCard 
        title="Base de Clientes" 
        subtitle={`${clients.length} clientes registrados`}
>
<div className="clientes__filters">
<input
            type="text"
            placeholder="Buscar por nombre o documento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
</div>
 
        
<GenericTable
          headers={["Cliente", "Documento", "Tipo", "Contacto", "Scoring", "Estado", "Acciones"]}
>
          {clients.map((client) => (
<tr key={client.id}>
<td>{client.name} {client.first_surname}</td>
<td>{client.nif}</td>
<td>{client.employment_status}</td>
<td>{client.contacto}</td>
<td>{client.scoring}</td>
<td>{client.estado}</td>
<td>
<button className="Edit_Client" onClick={() => {
  setClientEdit(client);
  setOpenForm(true);
}}>
  Editar
</button>
                
<button className="Delete_Client" onClick={() => deleteClient(client.id)}>
                  Eliminar
</button>
</td>
</tr>
          ))}
</GenericTable>
</GenericCard>
<FormClient
          open={openForm}
          close={() => setOpenForm(false)}
          saveClient={handleSave}
          clientEdit={clientEdit}
        />
</div>
  );
}
 
export default ListClient;