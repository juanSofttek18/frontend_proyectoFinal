import { useState, useEffect } from "react";
import "./FormClient.css";

function FormClient({
  open,
  close,
  saveClient,
  clientEdit,
}) {

  const [id, setId] = useState(null);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [documento, setDocumento] = useState("");
  const [tipo, setTipo] = useState("Particular");
  const [contacto, setContacto] = useState("");
  const [scoring, setScoring] = useState(750);
  const [estado, setEstado] = useState("Activo");

  
  useEffect(() => {

    if (clientEdit) {

      setId(clientEdit.id);
      setNombre(clientEdit.nombre);
      setApellido(clientEdit.apellido);
      setDocumento(clientEdit.documento);
      setTipo(clientEdit.tipo);
      setContacto(clientEdit.contacto);
      setScoring(clientEdit.scoring);
      setEstado(clientEdit.estado);

    } else {

      setId(null);
      setNombre("");
      setApellido("");
      setDocumento("");
      setTipo("Particular");
      setContacto("");
      setScoring(750);
      setEstado("Activo");
    }

  }, [clientEdit]);

  const handleSubmit = (e) => {

    e.preventDefault();

    const clientData = {
      id,
      nombre,
      apellido,
      documento,
      tipo,
      contacto,
      scoring,
      estado,
    };

    saveClient(clientData);

    close();
  };

  if (!open) return null;

  return (

    <div className="Modal_Overlay">

      <div className="Modal_Client">

        <div className="Modal_Header">

          <div>

            <h2>
              {clientEdit
                ? "Editar Cliente"
                : "Añadir Cliente"}
            </h2>

            <p>
              Completa la información del cliente
            </p>

          </div>

          <button onClick={close}>
            X
          </button>

        </div>

        <form onSubmit={handleSubmit}>

          <label>Tipo</label>

          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option>Particular</option>
            <option>Empresa</option>
          </select>

          <label>Nombre</label>

          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <label>Apellido</label>

          <input
            type="text"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
          />

          <label>Documento</label>

          <input
            type="text"
            value={documento}
            onChange={(e) => setDocumento(e.target.value)}
          />

          <label>Contacto</label>

          <input
            type="text"
            value={contacto}
            onChange={(e) => setContacto(e.target.value)}
          />

          <label>Scoring</label>

          <input
            type="number"
            value={scoring}
            onChange={(e) => setScoring(e.target.value)}
          />

          <label>Estado</label>

          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
          >
            <option>Activo</option>
            <option>Inactivo</option>
          </select>

          <div className="Modal_Actions">

            <button
              type="button"
              onClick={close}
            >
              Cancelar
            </button>

            <button type="submit">

              {clientEdit
                ? "Guardar Cambios"
                : "Guardar Cliente"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default FormClient;