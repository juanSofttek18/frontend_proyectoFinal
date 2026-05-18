import { useEffect, useState } from "react";
import axios from "axios";

export function useClient() {

  const [clients, setClients] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");



  async function getClients() {

    try {

      setLoading(true);

      const response = await axios.get(
        "http://localhost:8080/clientes",
        {
          params: {
            search: search,
          },
        }
      );

      setClients(response.data);

    } catch (err) {

      setError(err);

    } finally {

      setLoading(false);

    }
  }



  async function deleteClient(id) {

    try {

      await axios.delete(
        `http://localhost:8080/clientes/${id}`
      );

      setClients((prev) =>
        prev.filter((client) => client.id !== id)
      );

    } catch (err) {

      console.log(err);

    }
  }



  useEffect(() => {

    getClients();

  }, [search]);



  return {

    clients,
    loading,
    error,

    search,
    setSearch,

    deleteClient,

  };
}
