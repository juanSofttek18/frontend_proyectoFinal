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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!preTaxes || Number(preTaxes) <= 0 || !postTaxes || Number(postTaxes) <= 0 ) {
      setFormError("Ingresa valores válidos para pre_taxes y post_taxes.");
      return;
    }

    setFormError("");

    saveIncome(client.id, {
      pre_taxes: Number(preTaxes),
      post_taxes: Number(postTaxes),
      created_at: new Date().toISOString(),
    });

    close();
  };

  if (!open || !client) return null;

  return (
    <div className="Modal_Overlay">
      <div className="Modal_Client">
        <div className="Modal_Header">
          <div>
            <h2>Añadir Ingreso</h2>
            <p>
              Cliente: {client.name} {client.first_surname}
            </p>
          </div>
          <button onClick={close}>X</button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Pre-impuestos</label>
          <input
            type="number"
            value={preTaxes}
            onChange={(e) => setPreTaxes(e.target.value)}
            required
            min="0"
            step="0.01"
          />

          <label>Post-impuestos</label>
          <input
            type="number"
            value={postTaxes}
            onChange={(e) => setPostTaxes(e.target.value)}
            required
            min="0"
            step="0.01"
          />

          {formError && <p className="FormError">{formError}</p>}

          <div className="Modal_Actions">
            <button type="button" onClick={close}>
              Cancelar
            </button>
            <button type="submit">Guardar Ingreso</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormIngreso;
