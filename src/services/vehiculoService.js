import api from "./api";

// export function getAllAbleVehicles(){
//     return api.get("/vehicles/avaliable")
// }

export function getAllAbleVehicles(id) {
  console.log("ID recibido desde params:", id);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: [
          {
            id: 1,
            matricula: "1234ABC",
            marca: "Mercedes-Benz",
            modelo: "Clase A",
            precio: 35000,
            cilindrada: 1332,
            potencia: 163,
            color: "Blanco",
            plazas: 5,
            cuota_mensual_base: 420,
            disponibilidad: "Disponible"
          },
          {
            id: 2,
            matricula: "5678DEF",
            marca: "BMW",
            modelo: "Serie 1",
            precio: 37000,
            cilindrada: 1499,
            potencia: 170,
            color: "Azul Marino",
            plazas: 5,
            cuota_mensual_base: 450,
            disponibilidad: "Disponible"
          },
          {
            id: 3,
            matricula: "9012GHI",
            marca: "Audi",
            modelo: "A3",
            precio: 39000,
            cilindrada: 1498,
            potencia: 150,
            color: "Gris",
            plazas: 5,
            cuota_mensual_base: 470,
            disponibilidad: "Reservado"
          }
        ]
      });
    }, 1000);
  });
}

export function getOneVehicleById(id) {
  return api.get(`/vehicles/${id}`);
}