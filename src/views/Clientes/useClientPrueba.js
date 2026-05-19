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
          nombre: "Juan",
          apellido: "Pérez",
          documento: "12345678A",
          tipo: "Particular",
          contacto: "juan@email.com",
          scoring: 85,
          estado: "Activo",
        },
        {
          id: 2,
          nombre: "María",
          apellido: "Gómez",
          documento: "87654321B",
          tipo: "Empresa",
          contacto: "maria@empresa.com",
          scoring: 92,
          estado: "Activo",
        },
        {
          id: 3,
          nombre: "Carlos",
          apellido: "Ruiz",
          documento: "11223344C",
          tipo: "Particular",
          contacto: "carlos@email.com",
          scoring: 60,
          estado: "Inactivo",
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
    `${c.nombre} ${c.apellido} ${c.documento}`
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