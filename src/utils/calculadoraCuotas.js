export const calcularFactorPlazo = (plazo) => {
    const MESES_BASE = 12;
    let currentPlazo = Number(plazo) || MESES_BASE;

    // Forzar límites de negocio antes de calcular
    if (currentPlazo < 6) currentPlazo = 6;
    if (currentPlazo > 60) currentPlazo = 60;

    if (currentPlazo === MESES_BASE) return 1.0;

    if (currentPlazo < MESES_BASE) {
        const mesesReducidos = MESES_BASE - currentPlazo;
        return 1.0 + (mesesReducidos * 0.10);
    } else {
        const mesesAumentados = currentPlazo - MESES_BASE;
        const descuento = mesesAumentados * 0.03;
        const descuentoAplicado = Math.min(descuento, 0.20);
        return 1.0 - descuentoAplicado;
    }
};

export const calcularPrecioExtras = (extras = [], cuotaBaseAjustada = 0) => {
    let incrementoFijo = 0;
    let porcentajeTotal = 0;

    extras.forEach(extra => {
        if (!extra) return;
        if (extra.price && extra.price > 0) {
            incrementoFijo += Number(extra.price);
        }
        if (extra.percentage && extra.percentage > 0) {
            porcentajeTotal += Number(extra.percentage);
        }
    });

    const incrementoPorcentual = cuotaBaseAjustada * (porcentajeTotal / 100);
    return incrementoFijo + incrementoPorcentual;
};

export const calcularResumenSolicitud = (lineasVehiculos = [], plazo = 12) => {
    const factorPlazo = calcularFactorPlazo(plazo);
    let inversionTotal = 0;
    let cuotaMensualTotal = 0;

    const vehiculosDesglosados = lineasVehiculos.map((linea) => {
        if (!linea || !linea.vehiculo) return null;
        const { vehiculo, extras = [] } = linea;

        // CORRECCIÓN CRÍTICA: La cuota se calcula partiendo de base_monthly_fee (250€), NO de price (18000€)
        const cuotaBaseMatricula = Number(vehiculo.base_monthly_fee || 0);
        const cuotaBaseAjustada = cuotaBaseMatricula * factorPlazo;
        const costeExtras = calcularPrecioExtras(extras, cuotaBaseAjustada);
        const cuotaFinalVehiculo = cuotaBaseAjustada + costeExtras;

        inversionTotal += Number(vehiculo.price || 0);
        cuotaMensualTotal += cuotaFinalVehiculo;

        return {
            vehiculoId: vehiculo.id,
            brand: vehiculo.brand || 'Vehículo',
            model: vehiculo.model || 'Modelo',
            precioBase: Number(vehiculo.price || 0),
            cuotaBaseAjustada: cuotaBaseAjustada || 0,
            costeExtras: costeExtras || 0,
            cuotaFinal: cuotaFinalVehiculo || 0
        };
    }).filter(Boolean);

    return {
        plazoMeses: Number(plazo) > 60 ? 60 : (Number(plazo) < 6 ? 6 : Number(plazo)),
        factorPlazoAplicado: factorPlazo,
        inversionTotal: inversionTotal,
        cuotaMensualTotal: cuotaMensualTotal,
        vehicles: vehiculosDesglosados
    };
};