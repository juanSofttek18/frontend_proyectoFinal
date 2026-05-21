import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export const getClientes = async () => {
  const response = await axios.get(`${API_BASE_URL}/customers`);

  if (Array.isArray(response.data)) {
    return response.data;
  }

  return response.data.content || [];
};

export const getVehiculos = async () => {
  const response = await axios.get(`${API_BASE_URL}/vehicles`);
  return Array.isArray(response.data) ? response.data : [];
};

export const getExtras = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/extras`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    return [];
  }
};

export const getAllRequests = async () => {
  const response = await axios.get(`${API_BASE_URL}/requests`);
  return Array.isArray(response.data) ? response.data : response.data.content || [];
};

export const createRequest = async (solicitudDTO) => {
  const response = await axios.post(`${API_BASE_URL}/requests`, solicitudDTO);
  return response.data;
};

export const calculateVehiclePrice = async (calculationDTO) => {
  const response = await axios.post(
    `${API_BASE_URL}/vehicles/calculate-price`,
    calculationDTO
  );
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

export const getDashboardStats = async () => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/stats`);
  return response.data;
};
export const getRequestDetail = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/requests/${id}/details`);
  return response.data;
};