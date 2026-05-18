import api from "./api";

export function getAllAbleVehicles(){
    return api.get("/vehicles/avaliable")
}

export function getOneVehicleById(id) {
  return api.get(`/vehicles/${id}`);
}