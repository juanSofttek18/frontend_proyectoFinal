import { useClient } from "./useClient";
import "./Clientes.css";

function ListClient() {

  const {
    clients,
    loading,
    error,
    search,
    setSearch,
  } = useClient();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="List_Client">

      <div className="Header_Client">

        <div>
          <h1>Gestión de Clientes</h1>

          <p>
            Administra la información de tus clientes
            particulares y empresas
          </p>
        </div>

        <button className="Add_Client">
          Agregar Cliente
        </button>

      </div>

      <div className="clientes__card">

        <div className="clientes__card-header">
          <h2>Base de Clientes</h2>

          <span>
            {clients.length} clientes registrados
          </span>
        </div>

        <div className="clientes__filters">

          <input
            type="text"
            placeholder="Buscar por nombre o documento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        <table>

          <thead>
            <tr>
              <th>Cliente</th>
              <th>Documento</th>
              <th>Tipo</th>
              <th>Contacto</th>
              <th>Scoring</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>

            {clients.map((client) => (
              <tr key={client.id}>

                <td>
                  {client.nombre} {client.apellido}
                </td>

                <td>{client.documento}</td>

                <td>{client.tipo}</td>

                <td>{client.contacto}</td>

                <td>{client.scoring}</td>

                <td>{client.estado}</td>

                <td>
                  <button className="Edit_Client" size="icon" >
                    Editar
                  </button>
                  <button className="Delete_Client">
                    Eliminar
                  </button>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default ListClient;