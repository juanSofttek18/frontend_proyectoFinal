import React, { useState, useEffect } from "react";
import "./ListRequest.css";

export default function EditRequest({ open, close, onFormSubmit, saveRequest, requestEdit }) {
  const [formData, setFormData] = useState({
    id: "",
    clienteDni: "",
    vehiculoId: "",
    plazo: ""
  });

  useEffect(() => {
    if (requestEdit) {
      setFormData({
        id: requestEdit.id || "",
        clienteDni: requestEdit.clienteDni || "",
        vehiculoId: requestEdit.vehiculo?.id || requestEdit.vehiculoId || "",
        plazo: requestEdit.plazo || ""
      });
    }
  }, [requestEdit]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveRequest(formData);
    onFormSubmit();
  };

  return (
    <div className="modal-overlay">
      <div className="form-container">
        <div className="form-header">
          <h2>Modificar Solicitud #{formData.id}</h2>
          <button className="btn-close" onClick={close}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>DNI Cliente</label>
            <input
              type="text"
              name="clienteDni"
              value={formData.clienteDni}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>ID del Vehículo</label>
            <input
              type="text"
              name="vehiculoId"
              value={formData.vehiculoId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Plazo (meses)</label>
            <input
              type="number"
              name="plazo"
              value={formData.plazo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancelar" onClick={close}>
              Cancelar
            </button>
            <button type="submit" className="btn-add">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}