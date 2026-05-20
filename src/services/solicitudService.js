import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

// --- CLIENTES ---
export const getClientes = async () => {
  const response = await axios.get(`${API_BASE_URL}/customers`);

  // El backend devuelve Page<CustomerResponse>, no un array directo
  if (Array.isArray(response.data)) {
    return response.data;
  }

  return response.data.content || [];
};

// --- VEHÍCULOS ---
export const getVehiculos = async () => {
  const response = await axios.get(`${API_BASE_URL}/vehicles`);
  return Array.isArray(response.data) ? response.data : [];
};

// --- EXTRAS ---
export const getExtras = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/extras`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("No se pudieron cargar los extras:", error);
    return [];
  }
};

// --- SOLICITUDES ---
export const getPendingRequests = async () => {
  const response = await axios.get(`${API_BASE_URL}/requests/pending`);
  return Array.isArray(response.data) ? response.data : [];
};

export const createRequest = async (solicitudDTO) => {
  const response = await axios.post(`${API_BASE_URL}/requests`, solicitudDTO);
  return response.data;
};

export const resolveRequest = async (id, resolveDTO) => {
  const response = await axios.patch(
    `${API_BASE_URL}/requests/${id}/resolve`,
    resolveDTO
  );

  return response.data;
};

export const logicalDeleteRequest = async (id) => {
  await axios.delete(`${API_BASE_URL}/requests/${id}`);
};