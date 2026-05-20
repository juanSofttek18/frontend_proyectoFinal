import api from "./api";

// Mantenemos los parámetros que tu controlador de Spring Boot necesita recibir
export const getCustomers = async (page = 0, size = 10) => {
  const { data } = await api.get("/customers", {
    params: { page, size },
  });
  return data;
};

export const getCustomerById = async (id) => {
  const { data } = await api.get(`/customers/${id}`);
  return data;
};

export const createCustomer = async (customer) => {
  const { data } = await api.post("/customers", customer);
  return data;
};

export const updateCustomer = async (id, customer) => {
  const { data } = await api.put(`/customers/${id}`, customer);
  return data;
};

export const deleteCustomer = async (id) => {
  await api.delete(`/customers/${id}`);
};

// Nueva función del servicio para añadir los ingresos del cliente
export const addCustomerIncome = async (clientId, income) => {
  const { data } = await api.post(`/customers/${clientId}/incomes`, income);
  return data;
};