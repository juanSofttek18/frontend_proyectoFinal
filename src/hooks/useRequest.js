import { useState, useEffect, useCallback } from "react";
import {
  getPendingRequests,
  logicalDeleteRequest,
  resolveRequest,
  createRequest,
  updateRequest as updateRequestService
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
      alert(`Error al eliminar la solicitud: ${err.message}`);
    }
  }, []);

  const updateRequestStatus = useCallback(async (id, nuevoEstado) => {
    try {
      const resolveDTO = { status: nuevoEstado };
      await resolveRequest(id, resolveDTO);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(`Error al actualizar el estado: ${err.message}`);
      throw err;
    }
  }, []);

  const saveRequest = useCallback(async (dto) => {
    try {
      await createRequest(dto);
      await fetchRequests();
    } catch (err) {
      alert(`Error al guardar la solicitud: ${err.message}`);
      throw err;
    }
  }, [fetchRequests]);

  const updateRequest = useCallback(async (id, data) => {
    try {
      const updatedData = await updateRequestService(id, data);
      setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, ...updatedData } : r))
      );
      await fetchRequests();
    } catch (err) {
      alert(`Error al modificar la solicitud: ${err.message}`);
      throw err;
    }
  }, [fetchRequests]);

  return {
    requests,
    loading,
    error,
    deleteRequest,
    updateRequestStatus,
    saveRequest,
    updateRequest,
    refetchRequests: fetchRequests
  };
}