import axios from "axios";

const API_URL = "http://localhost:8080/api/requests";

export const getPendingRequests = async () => {
  const response = await axios.get(`${API_URL}/pending`);
  return response.data;
};

export const createRequest = async (createDTO) => {
  const response = await axios.post(API_URL, createDTO);
  return response.data;
};

export const resolveRequest = async (id, resolveDTO) => {
  const response = await axios.put(`${API_URL}/${id}/resolve`, resolveDTO);
  return response.data;
};

export const logicalDeleteRequest = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};