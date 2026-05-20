import { useEffect, useState } from "react";

export function useClient() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");


  useEffect(() => {
    try {
      setLoading(true);

      const fakeData = [
        {
          id: 1,
          name: "Juan",
          first_surname: "Pérez",
          nif: "12345678A",
          nationality: "Española",
          employment_status: "Particular",
          phone: "612345678",
          scoring: 85,
          is_active: true,
        },
        {
          id: 2,
          name: "María",
          first_surname: "Gómez",
          nif: "87654321B",
          nationality: "Española",
          employment_status: "Empresa",
          phone: "698765432",
          scoring: 92,
          is_active: true,
        },
        {
          id: 3,
          name: "Carlos",
          first_surname: "Ruiz",
          nif: "11223344C",
          nationality: "Española",
          employment_status: "Particular",
          phone: "654321987",
          scoring: 60,
          is_active: false,
        },
      ];

      setTimeout(() => {
        setClients(fakeData);
        setLoading(false);
      }, 600);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  }, []);


  const filteredClients = clients.filter((c) =>
    `${c.name} ${c.first_surname} ${c.nif}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );


  const addClient = (client) => {
    const newClient = {
      ...client,
      id: Date.now(), 
    };

    setClients((prev) => [...prev, newClient]);
  };

  const updateClient = (updatedClient) => {
    setClients((prev) =>
      prev.map((client) =>
        client.id === updatedClient.id
          ? updatedClient
          : client
      )
    );
  };


  const saveClient = (client) => {
    if (client.id) {
      updateClient(client);
    } else {
      addClient(client);
    }
  };

  const saveClientIncome = (clientId, ingreso) => {
    setClients((prev) =>
      prev.map((client) =>
        client.id === clientId
          ? {
              ...client,
              ingresos: [...(client.ingresos || []), ingreso],
            }
          : client
      )
    );
  };

  const deleteClient = (id) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
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
    setClients,
  };
}