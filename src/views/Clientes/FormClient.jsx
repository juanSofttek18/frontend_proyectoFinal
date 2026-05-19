import { useState, useEffect } from "react";
import "./FormClient.css";

function FormClient({
  open,
  close,
  saveClient,
  clientEdit,
}) {

  const [id, setId] = useState(null);
  const [name, setName] = useState("");
  const [first_surname, setFirstSurname] = useState("");
  const [nif, setNif] = useState("");
  const [employment_status, setEmploymentStatus] = useState("Particular");
  const [phone, setPhone] = useState("");
  const [scoring, setScoring] = useState(750);
  const [is_active, setIsActive] = useState(true);

  
  useEffect(() => {

    if (clientEdit) {

      setId(clientEdit.id);
      setName(clientEdit.name);
      setFirstSurname(clientEdit.first_surname);
      setNif(clientEdit.nif);
      setEmploymentStatus(clientEdit.employment_status);
      setPhone(clientEdit.phone);
      setScoring(clientEdit.scoring);
      setIsActive(clientEdit.is_active ? "Activo" : "Inactivo");

    } else {

      setId(null);
      setName("");
      setFirstSurname("");
      setNif("");
      setEmploymentStatus("Particular");
      setPhone("");
      setScoring(750);
      setIsActive("Activo");
    }

  }, [clientEdit]);

  const handleSubmit = (e) => {

    e.preventDefault();

    const clientData = {
      id,
      name,
      first_surname,
      nif,
      employment_status,
      phone,
      scoring,
      is_active,
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
            value={employment_status}
            onChange={(e) => setEmploymentStatus(e.target.value)}
          >
            <option>Particular</option>
            <option>Empresa</option>
          </select>

          <label>Nombre</label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Apellido</label>

          <input
            type="text"
            value={first_surname}
            onChange={(e) => setFirstSurname(e.target.value)}
          />

          <label>Documento</label>

          <input
            type="text"
            value={nif}
            onChange={(e) => setNif(e.target.value)}
          />

          <label>Contacto</label>

          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <label>Scoring</label>

          <input
            type="number"
            value={scoring}
            onChange={(e) => setScoring(e.target.value)}
          />

          <label>Estado</label>

          <select
            value={is_active ? "Activo" : "Inactivo"}
            onChange={(e) => setIsActive(e.target.value === "Activo")}
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