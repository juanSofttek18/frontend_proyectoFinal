import api from "./api";

// export function getAllAbleVehicles(){
//     return api.get("api/vehicles/avaliable")
// }

// export function getOneVehicleById(id) {
//   return api.get(`api/vehicles/${id}`);
// }

const vehiclesMock = [
  {
    id: 1,
    license_plate: "1234ABC",
    brand: "Mercedes-Benz",
    model: "Clase A",
    price: 35000,
    engine_size: 1332,
    potency: 163,
    color: "Blanco",
    spots: 5,
    base_monthly_fee: 420,
    available: true
  },
  {
    id: 2,
    license_plate: "5678DEF",
    brand: "BMW",
    model: "Serie 1",
    price: 37000,
    engine_size: 1499,
    potency: 170,
    color: "Azul Marino",
    spots: 5,
    base_monthly_fee: 450,
    available: true
  },
  {
    id: 3,
    license_plate: "9012GHI",
    brand: "Audi",
    model: "A3",
    price: 39000,
    engine_size: 1498,
    potency: 150,
    color: "Gris",
    spots: 5,
    base_monthly_fee: 470,
    available: false
  }
];

const extrasMock = [
  {
    id: 1,
    name: "Llantas deportivas",
    price: 850,
    category: "WHEELS",
    percentage: null
  },
  {
    id: 2,
    name: "Color metalizado",
    price: 600,
    category: "COLOR",
    percentage: null
  },
  {
    id: 3,
    name: "Tapicería premium",
    price: 1200,
    category: "TAPESTRY",
    percentage: null
  },
  {
    id: 4,
    name: "Sistema de sonido avanzado",
    price: null,
    category: "RADIO",
    percentage: 0.21
  },
  {
    id: 5,
    name: "Faros LED inteligentes",
    price: 700,
    category: "LIGHTS",
    percentage: null
  }
];

export function getAllAbleVehicles() {
  console.log("Cargando catálogo simulado");

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: vehiclesMock
      });
    }, 1000);
  });
}

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