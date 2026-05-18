const API_BASE_URL = 'http://localhost:8080/api';

export const getVehiculos = async () => {
    const response = await fetch(`${API_BASE_URL}/vehiculos`);
    if (!response.ok) {
        throw new Error('No se pudo cargar la lista de vehículos.');
    }
    return response.json();
};

export const getExtras = async () => {
    const response = await fetch(`${API_BASE_URL}/extras`);
    if (!response.ok) {
        throw new Error('No se pudo cargar la lista de extras.');
    }
    return response.json();
};

export const getSolicitudes = async () => {
    const response = await fetch(`${API_BASE_URL}/solicitudes`);
    if (!response.ok) {
        throw new Error('No se pudo cargar el listado de solicitudes.');
    }
    return response.json();
};

/**
 * Actualiza el estado de una solicitud.
 * @param {number|string} id - El ID de la solicitud.
 * @param {string} estado - El nuevo estado ('APROBADA', 'DENEGADA', 'APROBADA_CON_GARANTIAS').
 * @returns {Promise<object>}
 */
export const actualizarEstadoSolicitud = async (id, estado) => {
    const response = await fetch(`${API_BASE_URL}/solicitudes/${id}/estado`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado }),
    });
    if (!response.ok) {
        throw new Error(`No se pudo actualizar el estado de la solicitud.`);
    }
    return response.json();
};

/**
 * Realiza un borrado lógico de una solicitud.
 * @param {number|string} id - El ID de la solicitud a eliminar.
 * @returns {Promise<void>}
 */
export const enviarSolicitud = async (formData) => {
    const response = await fetch(`${API_BASE_URL}/solicitudes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    });

    if (!response.ok) {
        throw new Error('No se pudo completar la solicitud. Inténtalo de nuevo más tarde.');
    }

    return response.json();
};

export const eliminarSolicitud = async (id) => {
    const response = await fetch(`${API_BASE_URL}/solicitudes/${id}`, {
        method: 'DELETE', // Este método realiza un borrado lógico en el backend
    });
    if (!response.ok) {
        throw new Error('No se pudo eliminar la solicitud.');
    }
    if (response.status === 204) {
        return;
    }
    return response.json();
};