<<<<<<< HEAD
import { useClient } from "./useClient";
import "./Client.css";

=======
import { useClient } from "./useClientPrueba";
import GenericTable from "../../components/GenericTable"; 
import GenericCard from "../../components/GenericCard";
import "./Client.css";
 
>>>>>>> feature/Alejandro
function ListClient() {
  const { clients, loading, error, search, setSearch, deleteClient } = useClient();
 
  if (loading) return <p>Loading clients data...</p>;
  if (error) return <p>Error: {error.message}</p>;
 
  return (
<div className="List_Client">
<div className="Header_Client">
<div>
<h1>Gestión de Clientes</h1>
<p>Administra la información de tus clientes particulares y empresas</p>
</div>
<button className="Add_Client">Agregar Cliente</button>
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
<td>{client.nombre} {client.apellido}</td>
<td>{client.documento}</td>
<td>{client.tipo}</td>
<td>{client.contacto}</td>
<td>{client.scoring}</td>
<td>{client.estado}</td>
<td>
<button className="Edit_Client">Editar</button>
                
<button className="Delete_Client" onClick={() => deleteClient(client.id)}>
                  Eliminar
</button>
</td>
</tr>
          ))}
</GenericTable>
</GenericCard>
</div>
  );
}
 
export default ListClient;