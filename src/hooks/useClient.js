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

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getCustomers(page, size);
      
      setClients(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);

    } catch (err) {
      console.error("Error al traer clientes:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [page]);

  
  const filteredClients = clients.filter((c) => {
    const name = c.name || "";
    const firstSurname = c.first_surname || c.firstSurname || "";
    const secondSurname = c.second_surname || c.secondSurname || "";
    const nif = c.nif || "";
    const nationality = c.nationality || "";

    const searchString = `${name} ${firstSurname} ${secondSurname} ${nif} ${nationality}`;
    return searchString.toLowerCase().includes(search.toLowerCase().trim());
  });

  const cleanData = (data) => {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, value === "" ? null : value])
    );
  };

  const addClient = async (client) => {
    try {
      setError(null);
      const cleaned = cleanData(client);
      const newClient = await createCustomer(cleaned);
      setClients((prev) => [...prev, newClient]);
    } catch (err) {
      console.error("Error al añadir cliente:", err);
      setError(err);
    }
  };

  const updateClient = async (client) => {
    try {
      setError(null);
      const cleaned = cleanData(client);
      const updated = await updateCustomer(client.id, cleaned);

      setClients((prev) =>
        prev.map((c) => (c.id === client.id ? updated : c))
      );
    } catch (err) {
      console.error("Error al actualizar cliente:", err);
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
      setError(null);
      const cleanedIncome = cleanData(income);
      const response = await addCustomerIncome(clientId, cleanedIncome);

      setClients((prev) =>
        prev.map((client) => {
          if (client.id !== clientId) return client;

          
          if (response && response.id && response.ingresos) {
            return response;
          }


          const currentIncomes = client.ingresos || client.incomes || [];
          return {
            ...client,
            ingresos: [...currentIncomes, response],
          };
        })
      );
    } catch (err) {
      console.error("Error al añadir ingresos:", err);
      setError(err);
    }
  };

  const deleteClient = async (id) => {
    try {
      setError(null);
      await deleteCustomer(id);
      setClients((prev) => prev.filter((c) => c.id !== id));
      
      if (clients.length === 1 && page > 0) {
        setPage((p) => p - 1);
      }
    } catch (err) {
      console.error("Error al eliminar cliente:", err);
      setError(err);
    }
  };

  return {
    clients: filteredClients,
    loading,
    error,
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    totalElements,
    nextPage: () => page < totalPages - 1 && setPage((p) => p + 1),
    prevPage: () => page > 0 && setPage((p) => p - 1),
    isFirstPage: page === 0,
    isLastPage: page >= totalPages - 1,
    deleteClient,
    saveClient,
    saveClientIncome,
    refreshClients: fetchClients,
  };
}