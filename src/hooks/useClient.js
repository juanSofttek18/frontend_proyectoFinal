import { useEffect, useState } from "react";
import {
  getClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
} from "../services/clientService";

export function useClient() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  //  CARGAR CLIENTES
  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getClientes();
      setClients(data);

    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // 🔍 FILTRO
  const filteredClients = clients.filter((c) =>
    `${c.nombre} ${c.apellido} ${c.documento}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  //  CREAR CLIENTE
  const addClient = async (client) => {
    try {
      const newClient = await crearCliente(client);
      setClients((prev) => [...prev, newClient]);
    } catch (err) {
      setError(err);
    }
  };

  //  ACTUALIZAR CLIENTE
  const updateClient = async (client) => {
    try {
      const updated = await actualizarCliente(client.id, client);

      setClients((prev) =>
        prev.map((c) =>
          c.id === client.id ? updated : c
        )
      );
    } catch (err) {
      setError(err);
    }
  };

  //  GUARDAR (CREATE + UPDATE)
  const saveClient = async (client) => {
    if (client.id) {
      await updateClient(client);
    } else {
      await addClient(client);
    }
  };

  // ELIMINAR
  const deleteClient = async (id) => {
    try {
      await eliminarCliente(id);
      setClients((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err);
    }
  };

  return {
    clients: filteredClients,
    loading,
    error,
    search,
    setSearch,
    deleteClient,
    saveClient,
    refreshClients: fetchClients,
  };
}