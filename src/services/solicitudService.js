let solicitudesMock = [
    {
        id: 1,
        clienteDni: "12345678A",
        vehiculo: { id: 1, marca: "Mercedes-Benz", modelo: "Clase A", precio: 35000 },
        color: "Blanco",
        extras: [1, 2],
        plazo: 24,
        estado: "PENDIENTE"
    },
    {
        id: 2,
        clienteDni: "87654321B",
        vehiculo: { id: 2, marca: "BMW", modelo: "Serie 1", precio: 37000 },
        color: "Azul Marino",
        extras: [],
        plazo: 36,
        estado: "APROBADA"
    },
    {
        id: 3,
        clienteDni: "11223344C",
        vehiculo: { id: 3, marca: "Audi", modelo: "A3", precio: 39000 },
        color: "Gris",
        extras: [3],
        plazo: 48,
        estado: "DENEGADA"
    }
];

const vehiculosFormMock = [
    { id: 1, marca: "Mercedes-Benz", modelo: "Clase A", precio: 35000, coloresDisponibles: ["Blanco", "Negro", "Gris"] },
    { id: 2, marca: "BMW", modelo: "Serie 1", precio: 37000, coloresDisponibles: ["Azul Marino", "Blanco"] },
    { id: 3, marca: "Audi", modelo: "A3", precio: 39000, coloresDisponibles: ["Gris", "Rojo", "Negro"] }
];

const extrasFormMock = [
    { id: 1, nombre: "Llantas deportivas", tipoAumento: "FIJO", valor: 850 },
    { id: 2, nombre: "Color metalizado", tipoAumento: "FIJO", valor: 600 },
    { id: 3, nombre: "Sistema de sonido", tipoAumento: "PORCENTUAL", valor: 21 }
];

export function getSolicitudes() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...solicitudesMock]);
        }, 800);
    });
}

export function enviarSolicitud(formData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const vehiculoSeleccionado = vehiculosFormMock.find(v => String(v.id) === String(formData.vehiculoId));

            if (!vehiculoSeleccionado) {
                reject(new Error("Vehículo no válido"));
                return;
            }

            const nuevaSolicitud = {
                id: Date.now(),
                clienteDni: formData.dni,
                vehiculo: vehiculoSeleccionado,
                color: formData.color,
                extras: formData.extras,
                plazo: formData.plazo,
                estado: "PENDIENTE"
            };

            solicitudesMock.push(nuevaSolicitud);
            resolve(nuevaSolicitud);
        }, 1000);
    });
}

export function eliminarSolicitud(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const existe = solicitudesMock.find(s => s.id === id);
            if (!existe) {
                reject(new Error("Solicitud no encontrada"));
                return;
            }
            solicitudesMock = solicitudesMock.filter(s => s.id !== id);
            resolve({ success: true });
        }, 600);
    });
}

export function actualizarEstadoSolicitud(id, nuevoEstado) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = solicitudesMock.findIndex(s => s.id === id);
            if (index === -1) {
                reject(new Error("Solicitud no encontrada"));
                return;
            }

            solicitudesMock[index] = { ...solicitudesMock[index], estado: nuevoEstado };
            resolve(solicitudesMock[index]);
        }, 600);
    });
}

export function getVehiculos() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...vehiculosFormMock]);
        }, 700);
    });
}

export function getExtras() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...extrasFormMock]);
        }, 700);
    });
}