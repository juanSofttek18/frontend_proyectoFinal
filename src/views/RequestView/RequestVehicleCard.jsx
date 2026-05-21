import React from "react";

export default function RequestVehicleCard({
                                             index,
                                             line,
                                             vehiculos,
                                             extras,
                                             priceResult,
                                             periodInMonths,
                                             showRemoveButton,
                                             onRemove,
                                             onVehicleChange,
                                             onExtraChange,
                                             onNoExtraForCategory,
                                           }) {
  const selectedVehicle = vehiculos.find(
      (vehicle) => String(vehicle.id) === String(line.vehicleId)
  );

  const selectedExtras = extras.filter((extra) =>
      (line.extraIds || []).some((id) => String(id) === String(extra.id))
  );

  const formatCurrency = (val) => {
    const num = Number(val);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  const getCategoryText = (category) => {
    if (category === "WHEELS") return "Ruedas";
    if (category === "COLOR") return "Color";
    if (category === "TAPESTRY") return "Tapicería";
    if (category === "RADIO") return "Radio";
    if (category === "LIGHTS") return "Luces";
    return category || "Otros";
  };

  const getExtraPriceText = (extra) => {
    if (extra.price) {
      return `+${extra.price}€/mes`;
    }
    if (extra.percentage) {
      return `+${extra.percentage}%`;
    }
    return "";
  };

  const getExtrasGroupedByCategory = () => {
    return extras.reduce((groups, extra) => {
      const category = extra.category || "OTROS";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(extra);
      return groups;
    }, {});
  };

  const isExtraSelected = (extraId) => {
    return (line.extraIds || []).some((id) => String(id) === String(extraId));
  };

  const hasSelectedExtraInCategory = (category) => {
    return extras.some(
        (extra) =>
            extra.category === category &&
            (line.extraIds || []).some((id) => String(id) === String(extra.id))
    );
  };

  // Cálculos locales seguros de IVA en tiempo real
  const finalMonthlyFee = priceResult ? Number(priceResult.finalMonthlyFee) : 0;
  const calculatedIva = !isNaN(finalMonthlyFee) ? finalMonthlyFee * 0.21 : 0;
  const calculatedTotalWithIva = !isNaN(finalMonthlyFee) ? finalMonthlyFee * 1.21 : 0;

  return (
      <div className="request-vehicle-card">
        <div className="request-vehicle-card-header">
          <strong>Vehículo #{index + 1}</strong>

          {showRemoveButton && (
              <button
                  type="button"
                  onClick={onRemove}
                  className="btn-remove-vehicle"
              >
                Eliminar
              </button>
          )}
        </div>

        <label>Vehículo</label>
        <select
            value={line.vehicleId}
            onChange={(event) => onVehicleChange(event.target.value)}
            required
        >
          <option value="">-- Seleccione un vehículo --</option>
          {vehiculos.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.licensePlate} - {vehicle.brand} {vehicle.model} - {vehicle.price} €
              </option>
          ))}
        </select>

        {selectedVehicle && (
            <div className="vehicle-info-box">
              <p>
                <strong>Marca:</strong> {selectedVehicle.brand}
              </p>
              <p>
                <strong>Modelo:</strong> {selectedVehicle.model}
              </p>
              <p>
                <strong>Color:</strong> {selectedVehicle.color}
              </p>
              <p>
                <strong>Cuota base:</strong> {selectedVehicle.baseMonthlyFee} €/mes
              </p>
            </div>
        )}

        <label>Extras</label>

        {extras.length === 0 ? (
            <p className="empty-extras-message">No hay extras disponibles.</p>
        ) : (
            <div className="extras-category-list">
              {Object.entries(getExtrasGroupedByCategory()).map(
                  ([category, categoryExtras]) => (
                      <div key={category} className="extra-category-box">
                        <h4>{getCategoryText(category)}</h4>

                        <div className="extra-options-row">
                          <button
                              type="button"
                              className={
                                hasSelectedExtraInCategory(category)
                                    ? "extra-option-btn"
                                    : "extra-option-btn selected"
                              }
                              onClick={() => onNoExtraForCategory(category)}
                          >
                            Sin extra
                          </button>

                          {categoryExtras.map((extra) => (
                              <button
                                  type="button"
                                  key={extra.id}
                                  className={
                                    isExtraSelected(extra.id)
                                        ? "extra-option-btn selected"
                                        : "extra-option-btn"
                                  }
                                  onClick={() => onExtraChange(extra)}
                              >
                                <span>{extra.name}</span>
                                <small>{getExtraPriceText(extra)}</small>
                              </button>
                          ))}
                        </div>
                      </div>
                  )
              )}
            </div>
        )}

        {selectedExtras.length > 0 && (
            <div className="selected-extras-box">
              <strong>Extras seleccionados:</strong>
              <ul>
                {selectedExtras.map((extra) => (
                    <li key={extra.id}>
                      {getCategoryText(extra.category)}: {extra.name} {getExtraPriceText(extra)}
                    </li>
                ))}
              </ul>
            </div>
        )}

        {selectedVehicle && priceResult && (
            <div className="vehicle-price-breakdown">
              <h4>Desglose de Precios</h4>

              <div className="price-row">
                <span>Cuota Base:</span>
                <span>
              {formatCurrency(selectedVehicle.baseMonthlyFee)} €/mes
            </span>
              </div>

              <div className="price-row">
                <span>Extras Porcentuales:</span>
                <span>
              + {formatCurrency(priceResult.extraPercentageIncrement)} €/mes
            </span>
              </div>

              <div className="price-row">
                <span>Inversión Final (Neto):</span>
                <span>{formatCurrency(priceResult.finalInvestment)} €</span>
              </div>

              <div className="price-row">
                <span>Cuota Base Mensual:</span>
                <span>{formatCurrency(priceResult.finalMonthlyFee)} €/mes</span>
              </div>

              <div className="price-row">
                <span>IVA (21%):</span>
                <span>{formatCurrency(calculatedIva)} €/mes</span>
              </div>

              {/* Ajuste por Plazo reubicado aquí abajo */}
              <div className="price-row">
                <span>Ajuste por Plazo ({periodInMonths} meses):</span>
                <span
                    className={
                      Number(priceResult.termAdjustment) < 0
                          ? "discount"
                          : Number(priceResult.termAdjustment) > 0
                              ? "penalty"
                              : ""
                    }
                >
              {Number(priceResult.termAdjustment) >= 0 ? "+" : ""}
                  {formatCurrency(priceResult.termAdjustment)} €/mes
            </span>
              </div>

              <div className="price-row highlight">
                <span>Cuota con IVA:</span>
                <span>{formatCurrency(calculatedTotalWithIva)} €/mes</span>
              </div>
            </div>
        )}
      </div>
  );
}