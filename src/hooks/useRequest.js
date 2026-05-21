import { useState, useEffect, useCallback } from "react";
import {
  getAllRequests,
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

      const data = await getAllRequests();
      setRequests(data);
      setLoading("success");
    } catch (err) {
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
      await fetchRequests();
    } catch (err) {
      alert(
          "No se pudo eliminar la solicitud. Recuerda que el backend no permite borrar solicitudes aprobadas."
      );
    }
  }, [fetchRequests]);

  const updateRequestStatus = useCallback(async (id, nuevoEstado) => {
    try {
      const dto = {
        status: nuevoEstado,
      };

      await resolveRequest(id, dto);
      await fetchRequests();
    } catch (err) {
      alert("No se pudo cambiar el estado de la solicitud.");
      throw err;
    }
  }, [fetchRequests]);

  const saveRequest = useCallback(
      async (dto) => {
        try {
          await createRequest(dto);
          await fetchRequests();
        } catch (err) {
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