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
          employment_status: "Particular",
          phone: "juan@email.com",
          scoring: 85,
          is_active: true,
        },
        {
          id: 2,
          name: "María",
          first_surname: "Gómez",
          nif: "87654321B",
          employment_status: "Empresa",
          phone: "maria@empresa.com",
          scoring: 92,
          is_active: true,
        },
        {
          id: 3,
          name: "Carlos",
          first_surname: "Ruiz",
          nif: "11223344C",
          employment_status: "Particular",
          phone: "carlos@email.com",
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
    setClients, 
  };
}