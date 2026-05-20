import api from "./api";

export function getAllAbleVehicles(){
    return api.get("/vehicles")
 }

export function getOneVehicleById(id) {
  return api.get(`/vehicles/${id}`);
}



export function getAllExtras() {
  return api.get("/extras");
}


export async function getVehicleDetailWithExtras(id) {
  const vehicleResponse = await getOneVehicleById(id);
  const extrasResponse = await getAllExtras();

  return {
    data: {
      ...vehicleResponse.data,
      extras: extrasResponse.data
    }
  };
}