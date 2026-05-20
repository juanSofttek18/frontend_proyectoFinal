import api from "./api";

    
// GET customers

export const getCustomers = async () => {
  const { data } = await api.get("/clientes");
  return data;
};

// POST income for customer

export const addCustomerIncome = async (id, income) => {
  const { data } = await api.post(`/clientes/${id}/ingresos`, income);
  return data;
};


// POST customer

export const createCustomer = async (customer) => {
  const { data } = await api.post("/clientes", customer);
  return data;
};


// PUT customer

export const updateCustomer = async (id, customer) => {
  const { data } = await api.put(`/clientes/${id}`, customer);
  return data;
};


// DELETE customer
 
export const deleteCustomer = async (id) => {
  await api.delete(`/clientes/${id}`);
};