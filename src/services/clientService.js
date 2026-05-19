import api from "./api";

    
// GET clientes

export const getClientes = async () => {
  const { data } = await api.get("/clientes");
  return data;
};


// POST cliente

export const crearCliente = async (cliente) => {
  const { data } = await api.post("/clientes", cliente);
  return data;
};


// PUT cliente

export const actualizarCliente = async (id, cliente) => {
  const { data } = await api.put(`/clientes/${id}`, cliente);
  return data;
};


// DELETE cliente
 
export const eliminarCliente = async (id) => {
  await api.delete(`/clientes/${id}`);
};