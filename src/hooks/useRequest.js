import { useState, useEffect, useCallback } from "react";
import {
  getPendingRequests,
  logicalDeleteRequest,
  resolveRequest,
  createRequest
} from "../services/solicitudService";

export function useRequest() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPendingRequests();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Error al cargar las solicitudes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const deleteRequest = useCallback(async (id) => {
    try {
      await logicalDeleteRequest(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(`Error al eliminar: ${err.message}`);
    }
  }, []);

  const updateRequestStatus = useCallback(async (id, nuevoEstado) => {
    try {
      const updatedData = await resolveRequest(id, { status: nuevoEstado });
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? updatedData : r))
      );
    } catch (err) {
      alert(`Error al actualizar el estado: ${err.message}`);
    }
  }, []);

  const saveRequest = useCallback(async (dto) => {
    try {
      await createRequest(dto);
      await fetchRequests();
    } catch (err) {
      alert(`Error al guardar: ${err.message}`);
    }
  }, [fetchRequests]);

  return {
    requests,
    loading,
    error,
    deleteRequest,
    updateRequestStatus,
    saveRequest
  };
}