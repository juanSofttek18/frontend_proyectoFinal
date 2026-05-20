import { useState, useEffect, useCallback } from "react";
import {
  getPendingRequests,
  logicalDeleteRequest,
  resolveRequest,
  createRequest,
} from "../services/solicitudService";

export function useRequest() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState("loading");
  const [error, setError] = useState(null);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading("loading");
      setError(null);

      const data = await getPendingRequests();
      setRequests(data);
      setLoading("success");
    } catch (err) {
      console.error("Error al cargar solicitudes:", err);
      setError(err.message || "Error al cargar las solicitudes");
      setLoading("error");
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const deleteRequest = useCallback(async (id) => {
    const confirmacion = window.confirm(
      `¿Seguro que quieres eliminar la solicitud #${id}?`
    );

    if (!confirmacion) return;

    try {
      await logicalDeleteRequest(id);

      setRequests((prev) => prev.filter((request) => request.id !== id));
    } catch (err) {
      console.error("Error al eliminar solicitud:", err);
      alert(
        "No se pudo eliminar la solicitud. Recuerda que el backend no permite borrar solicitudes aprobadas."
      );
    }
  }, []);

  const updateRequestStatus = useCallback(async (id, nuevoEstado) => {
    try {
      const dto = {
        status: nuevoEstado,
      };

      await resolveRequest(id, dto);

      
      setRequests((prev) => prev.filter((request) => request.id !== id));
    } catch (err) {
      console.error("Error al resolver solicitud:", err);
      alert("No se pudo cambiar el estado de la solicitud.");
      throw err;
    }
  }, []);

  const saveRequest = useCallback(
    async (dto) => {
      try {
        await createRequest(dto);
        await fetchRequests();
      } catch (err) {
        console.error("Error al crear solicitud:", err);
        alert("No se pudo crear la solicitud.");
        throw err;
      }
    },
    [fetchRequests]
  );

  return {
    requests,
    loading,
    error,
    deleteRequest,
    updateRequestStatus,
    saveRequest,
    refetchRequests: fetchRequests,
  };
}