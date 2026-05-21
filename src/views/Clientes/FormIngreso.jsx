import { useEffect, useState } from "react";
import "./FormClient.css";

function FormIngreso({ open, close, client, saveIncome }) {
  const [preTaxes, setPreTaxes] = useState("");
  const [postTaxes, setPostTaxes] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (open) {
      setPreTaxes("");
      setPostTaxes("");
      setFormError("");
    }
  }, [open, client]);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    !preTaxes ||
    Number(preTaxes) <= 0 ||
    !postTaxes ||
    Number(postTaxes) <= 0
  ) {
    setFormError("Ingresa valores válidos para ingresos brutos y netos.");
    return;
  }

  setFormError("");

  try {
    await saveIncome(client.id, {
      preTaxes: Number(preTaxes),
      postTaxes: Number(postTaxes),
    });

    close();
  } catch (err) {
    console.error("Error al guardar ingreso:", err);
    setFormError("No se pudo guardar el ingreso.");
  }
};

  if (!open || !client) return null;

  return (
      <div className="Modal_Overlay">
        <div className="Modal_Client">
          <div className="Modal_Header">
            <div>
              <h2>Añadir Ingreso</h2>
              <p>
                Cliente: {client.name} {client.firstSurname || client.first_surname || ""}
              </p>
            </div>
            <button type="button" onClick={close}>✕</button>
          </div>

          <form onSubmit={handleSubmit}>
            <label htmlFor="fi-preTaxes">Pre-impuestos</label>
            <input
                id="fi-preTaxes"
                type="number"
                value={preTaxes}
                onChange={(e) => setPreTaxes(e.target.value)}
                required
                min="0"
                step="0.01"
                placeholder="Ej: 2500.00"
            />

            <label htmlFor="fi-postTaxes">Post-impuestos</label>
            <input
                id="fi-postTaxes"
                type="number"
                value={postTaxes}
                onChange={(e) => setPostTaxes(e.target.value)}
                required
                min="0"
                step="0.01"
                placeholder="Ej: 1950.00"
            />

            {formError && <span className="FieldError">{formError}</span>}

            <div className="Modal_Actions">
              <button type="button" onClick={close}>
                Cancelar
              </button>
              <button type="submit">
                Guardar Ingreso
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}

export default FormIngreso;