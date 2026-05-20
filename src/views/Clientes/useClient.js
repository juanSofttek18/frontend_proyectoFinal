import { useEffect, useState } from "react";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  addCustomerIncome,
} from "../services/clientService";

export function useClient() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

 
  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getCustomers();
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

 
  const filteredClients = clients.filter((c) =>
    `${c.name} ${c.first_surname || ""} ${c.second_surname || ""} ${c.nif} ${c.nationality || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  
  const addClient = async (client) => {
    try {
      const newClient = await createCustomer(client);
      setClients((prev) => [...prev, newClient]);
    } catch (err) {
      setError(err);
    }
  };


  const updateClient = async (client) => {
    try {
      const updated = await updateCustomer(client.id, client);

      setClients((prev) =>
        prev.map((c) =>
          c.id === client.id ? updated : c
        )
      );
    } catch (err) {
      setError(err);
    }
  };


  const saveClient = async (client) => {
    if (client.id) {
      await updateClient(client);
    } else {
      await addClient(client);
    }
  };

  const saveClientIncome = async (clientId, income) => {
    try {
      const response = await addCustomerIncome(clientId, income);

      setClients((prev) =>
        prev.map((client) => {
          if (client.id !== clientId) return client;

          if (response && response.id && response.ingresos) {
            return response;
          }

          return {
            ...client,
            ingresos: [...(client.ingresos || []), response],
          };
        })
      );
    } catch (err) {
      setError(err);
    }
  };

 
  const deleteClient = async (id) => {
    try {
      await deleteCustomer(id);
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
    saveClientIncome,
    refreshClients: fetchClients,
  };
}