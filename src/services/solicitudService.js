import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

// --- CLIENTES ---
export const getClientes = async () => {
    const response = await axios.get(`${API_BASE_URL}/customers`);
    return response.data;
};

// --- VEHÍCULOS ---
export const getVehiculos = async () => {
    const response = await axios.get(`${API_BASE_URL}/vehicles`);
    return response.data;
};

// --- EXTRAS ---
export const getExtras = async () => {
    const response = await axios.get(`${API_BASE_URL}/extras`);
    return response.data;
};

// --- SOLICITUDES ---
export const getPendingRequests = async () => {
    const response = await axios.get(`${API_BASE_URL}/requests/pending`);
    return response.data;
};

export const createRequest = async (solicitudDTO) => {
    const response = await axios.post(`${API_BASE_URL}/requests`, solicitudDTO);
    return response.data;
};

export const updateRequest = async (id, solicitudDTO) => {
    const response = await axios.put(`${API_BASE_URL}/requests/${id}`, solicitudDTO);
    return response.data;
};

export const resolveRequest = async (id, resolveDTO) => {
    const response = await axios.put(`${API_BASE_URL}/requests/${id}/resolve`, resolveDTO);
    return response.data;
};

export const logicalDeleteRequest = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/requests/${id}`);
    return response.data;
};