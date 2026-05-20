/*import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

// --- CLIENTES ---
export const getClientes = async () => {
    const response = await axios.get(`${API_BASE_URL}/customers`);
    return response.data;
};

// --- VEHÍCULOS ---
export const getVehiculos = async () => {
    const response = await axios.get(`${API_BASE_URL}/vehicles`);
    return response.data;
};

// --- EXTRAS ---
export const getExtras = async () => {
    const response = await axios.get(`${API_BASE_URL}/extras`);
    return response.data;
};

// --- SOLICITUDES ---
export const getPendingRequests = async () => {
    const response = await axios.get(`${API_BASE_URL}/requests/pending`);
    return response.data;
};

export const createRequest = async (solicitudDTO) => {
    const response = await axios.post(`${API_BASE_URL}/requests`, solicitudDTO);
    return response.data;
};

export const updateRequest = async (id, solicitudDTO) => {
    const response = await axios.put(`${API_BASE_URL}/requests/${id}`, solicitudDTO);
    return response.data;
};

export const resolveRequest = async (id, resolveDTO) => {
    const response = await axios.put(`${API_BASE_URL}/requests/${id}/resolve`, resolveDTO);
    return response.data;
};

export const logicalDeleteRequest = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/requests/${id}`);
    return response.data;
};*/
// import axios from "axios"; // Comentado para la simulación

// --- INICIO DE LA SIMULACIÓN DE DATOS REALES ---

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let mockClientes = [
    { id: 1, name: 'Aaron', first_surname: 'Granado', second_surname: '', nif: '12345678A', nationality: 'Española', scoring: 750.00, employment_status: 'EMPLOYED', phone: '600111222', non_payment: 0, is_active: 1 },
    { id: 2, name: 'Laura', first_surname: 'Gómez', second_surname: 'Sanz', nif: '87654321B', nationality: 'Española', scoring: 620.50, employment_status: 'SELF_EMPLOYED', phone: '611222333', non_payment: 0, is_active: 1 },
    { id: 3, name: 'Carlos', first_surname: 'Martínez', second_surname: 'Ruiz', nif: '11223344C', nationality: 'Española', scoring: 450.00, employment_status: 'EMPLOYED', phone: '622333444', non_payment: 1, is_active: 1 }
];

let mockVehiculos = [
    { id: 1, license_plate: '1234ABC', brand: 'Seat', model: 'Ibiza', price: 18000.00, cc: 1000, potency: 95, color: 'Rojo', spots: 5, base_monthly_fee: 250.00, available: 1, extrasPermitidos: [1, 4] },
    { id: 2, license_plate: '5678DEF', brand: 'Renault', model: 'Clio', price: 17000.00, cc: 999, potency: 90, color: 'Azul', spots: 5, base_monthly_fee: 230.00, available: 1, extrasPermitidos: [4] },
    { id: 3, license_plate: '9012GHI', brand: 'Ford', model: 'Focus', price: 22000.00, cc: 1500, potency: 120, color: 'Negro', spots: 5, base_monthly_fee: 310.00, available: 1, extrasPermitidos: [1, 2, 3, 4, 5] },
    { id: 4, license_plate: '3456JKL', brand: 'Peugeot', model: '208', price: 19000.00, cc: 1200, potency: 100, color: 'Amarillo', spots: 5, base_monthly_fee: 270.00, available: 1, extrasPermitidos: [2, 4] },
    { id: 5, license_plate: '7890MNO', brand: 'Opel', model: 'Corsa', price: 16500.00, cc: 1200, potency: 75, color: 'Blanco', spots: 5, base_monthly_fee: 220.00, available: 1, extrasPermitidos: [1, 4] }
];

let mockExtras = [
    { id: 1, name: 'Techo solar', price: 800.00, category: 'LIGHTS', percentage: null },
    { id: 2, name: 'Llantas de aleación 18"', price: 600.00, category: 'WHEELS', percentage: null },
    { id: 3, name: 'Sistema de sonido premium', price: null, category: 'RADIO', percentage: 5.00 },
    { id: 4, name: 'Pintura metalizada', price: 500.00, category: 'COLOR', percentage: null },
    { id: 5, name: 'Tapicería de cuero Alcántara', price: 1200.00, category: 'TAPESTRY', percentage: null }
];

let mockRequests = [
    {
        id: 1,
        customerId: 1,
        dniCliente: '12345678A',
        periodInMonths: 24,
        state: 'PENDING_ANALYST',
        createdAt: '2026-05-19T10:00:00.000Z',
        resolutionDate: null,
        isActive: 1,
        vehicles: [
            { id_vehicle: 1, brand: 'Seat', model: 'Ibiza', color: 'Rojo', price: 18000.00, extras: [{ id_extra: 1, name: 'Techo solar', price: 800.00 }] },
            { id_vehicle: 3, brand: 'Ford', model: 'Focus', color: 'Negro', price: 22000.00, extras: [{ id_extra: 3, name: 'Sistema de sonido premium', percentage: 5.00 }] }
        ]
    }
];

let nextId = 2;

export const getClientes = async () => {
    await sleep(300);
    return JSON.parse(JSON.stringify(mockClientes.filter(c => c.is_active === 1)));
};

export const getVehiculos = async () => {
    await sleep(300);
    return JSON.parse(JSON.stringify(mockVehiculos.filter(v => v.available === 1)));
};

export const getExtras = async () => {
    await sleep(200);
    return JSON.parse(JSON.stringify(mockExtras));
};

export const getPendingRequests = async () => {
    await sleep(400);
    return JSON.parse(JSON.stringify(mockRequests.filter(r => r.state === 'PENDING_ANALYST' && r.isActive === 1)));
};

export const createRequest = async (solicitudDTO) => {
    await sleep(400);
    const lineasVehiculosMapeadas = solicitudDTO.vehicles.map(v => {
        const matchV = mockVehiculos.find(mv => mv.id === v.vehicleId);
        const matchExtras = v.extrasIds.map(eId => {
            const me = mockExtras.find(m => m.id === eId);
            return { id_extra: me.id, name: me.name, price: me.price, percentage: me.percentage };
        });
        return {
            id_vehicle: v.vehicleId,
            brand: matchV ? matchV.brand : 'Desconocido',
            model: matchV ? matchV.model : 'Desconocido',
            price: matchV ? matchV.price : 0,
            color: v.color,
            extras: matchExtras
        };
    });

    const newRequest = {
        id: nextId++,
        customerId: solicitudDTO.customerId,
        dniCliente: solicitudDTO.dni,
        periodInMonths: solicitudDTO.plazo,
        state: 'PENDING_ANALYST',
        createdAt: new Date().toISOString(),
        resolutionDate: null,
        isActive: 1,
        vehicles: lineasVehiculosMapeadas
    };
    mockRequests.push(newRequest);
    return newRequest;
};

export const updateRequest = async (id, solicitudDTO) => {
    await sleep(400);
    const index = mockRequests.findIndex(r => r.id === Number(id));
    if (index === -1) throw new Error("Solicitud no encontrada.");

    const lineasVehiculosMapeadas = solicitudDTO.vehicles.map(v => {
        const matchV = mockVehiculos.find(mv => mv.id === v.vehicleId);
        const matchExtras = v.extrasIds.map(eId => {
            const me = mockExtras.find(m => m.id === eId);
            return { id_extra: me.id, name: me.name, price: me.price, percentage: me.percentage };
        });
        return {
            id_vehicle: v.vehicleId,
            brand: matchV ? matchV.brand : 'Desconocido',
            model: matchV ? matchV.model : 'Desconocido',
            price: matchV ? matchV.price : 0,
            color: v.color,
            extras: matchExtras
        };
    });

    mockRequests[index] = {
        ...mockRequests[index],
        periodInMonths: solicitudDTO.periodInMonths,
        vehicles: lineasVehiculosMapeadas
    };
    return JSON.parse(JSON.stringify(mockRequests[index]));
};

export const resolveRequest = async (id, resolveDTO) => {
    await sleep(300);
    const index = mockRequests.findIndex(r => r.id === Number(id));
    if (index === -1) throw new Error("Solicitud no encontrada.");
    mockRequests[index].state = resolveDTO.status;
    mockRequests[index].resolutionDate = new Date().toISOString();
    return JSON.parse(JSON.stringify(mockRequests[index]));
};

export const logicalDeleteRequest = async (id) => {
    await sleep(200);
    const index = mockRequests.findIndex(r => r.id === Number(id));
    if (index !== -1) {
        mockRequests[index].isActive = 0;
    }
};