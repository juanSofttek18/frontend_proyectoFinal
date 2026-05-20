import api from "./api";

export function getAllAbleVehicles(){
    return api.get("/vehicles")
 }

// export function getOneVehicleById(id) {
//   return api.get(`api/vehicles/${id}`);
// }

// const extrasMock = [
//   {
//     id: 1,
//     name: "Llantas deportivas",
//     price: 850,
//     category: "WHEELS",
//     percentage: null
//   },
//   {
//     id: 2,
//     name: "Color metalizado",
//     price: 600,
//     category: "COLOR",
//     percentage: null
//   },
//   {
//     id: 3,
//     name: "Tapicería premium",
//     price: 1200,
//     category: "TAPESTRY",
//     percentage: null
//   },
//   {
//     id: 4,
//     name: "Sistema de sonido avanzado",
//     price: null,
//     category: "RADIO",
//     percentage: 0.21
//   },
//   {
//     id: 5,
//     name: "Faros LED inteligentes",
//     price: 700,
//     category: "LIGHTS",
//     percentage: null
//   }
// ];


export function getOneVehicleById(id) {
  console.log("Cargando detalle simulado. ID:", id);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const vehicle = vehiclesMock.find((vehicle) => vehicle.id === Number(id));

      if (!vehicle) {
        reject(new Error("Vehículo no encontrado"));
        return;
      }

      resolve({
        data: vehicle
      });
    }, 1000);
  });
}

// export function getAllExtras() {
//   return api.get("/extras");
// }

export function getAllExtras() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: extrasMock
      });
    }, 700);
  });
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