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
  const [second_surname, setSecondSurname] = useState("");
  const [nif, setNif] = useState("");
  const [nationality, setNationality] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [career_time, setCareerTime] = useState("");
  const [employment_status, setEmploymentStatus] = useState("EMPLOYED");
  const [phone, setPhone] = useState("");
  const [scoring, setScoring] = useState(0);
  const [non_payment, setNonPayment] = useState(false);
  const [is_active, setIsActive] = useState(true);
  const [formError, setFormError] = useState("");

  
  useEffect(() => {

    if (clientEdit) {

      setId(clientEdit.id);
      setName(clientEdit.name || "");
      setFirstSurname(clientEdit.first_surname || "");
      setSecondSurname(clientEdit.second_surname || "");
      setNif(clientEdit.nif || "");
      setNationality(clientEdit.nationality || "");
      setBirthdate(clientEdit.birthdate ? clientEdit.birthdate.slice(0, 10) : "");
      setCareerTime(clientEdit.career_time ? clientEdit.career_time.slice(0, 10) : "");
      setEmploymentStatus(clientEdit.employment_status || "EMPLOYED");
      setPhone(clientEdit.phone || "");
      setScoring(clientEdit.scoring ?? 0);
      setNonPayment(Boolean(clientEdit.non_payment));
      setIsActive(Boolean(clientEdit.is_active));

    } else {

      setId(null);
      setName("");
      setFirstSurname("");
      setSecondSurname("");
      setNif("");
      setNationality("");
      setBirthdate("");
      setCareerTime("");
      setEmploymentStatus("EMPLOYED");
      setPhone("");
      setScoring(0);
      setNonPayment(false);
      setIsActive(true);
    }

  }, [clientEdit]);

  const handleSubmit = (e) => {

    e.preventDefault();

    const numericScoring = Number(scoring);
    if (!name.trim() || !first_surname.trim() || !nif.trim() || !nationality.trim() || !birthdate || !career_time || !phone.trim() || scoring === "" || scoring === null) {
      setFormError("Por favor completa todos los campos obligatorios.");
      return;
    }
    if (Number.isNaN(numericScoring) || numericScoring < 0 || numericScoring > 100) {
      setFormError("El scoring debe estar entre 0 y 100.");
      return;
    }

    setFormError("");

    const clientData = {
      id,
      name,
      first_surname,
      second_surname: second_surname.trim() || null,
      nif,
      nationality,
      birthdate,
      career_time,
      employment_status,
      phone,
      scoring: Number(scoring),
      non_payment,
      is_active,
    };

    saveClient(clientData);

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
            <option value="EMPLOYED">Trabajador</option>
            <option value="SELF_EMPLOYED">Trabajador cuenta propia</option>
          </select>

          <label>Nombre</label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Apellido</label>

          <input
            type="text"
            value={first_surname}
            onChange={(e) => setFirstSurname(e.target.value)}
            required
          />

          <label>Segundo apellido</label>

          <input
            type="text"
            value={second_surname}
            onChange={(e) => setSecondSurname(e.target.value)}
          />

          <label>NIF</label>

          <input
            type="text"
            value={nif}
            onChange={(e) => setNif(e.target.value)}
            required
          />

          <label>Nacionalidad</label>

          <input
            type="text"
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            required
          />

          <label>Fecha de nacimiento</label>

          <input
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            required
          />

          <label>Fecha de inicio de carrera</label>

          <input
            type="date"
            value={career_time}
            onChange={(e) => setCareerTime(e.target.value)}
            required
          />

          <label>Contacto</label>

          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <label>Scoring</label>

          <input
            type="number"
            value={scoring}
            onChange={(e) => setScoring(e.target.value)}
            required
            min="0"
            max="100"
            step="1"
          />

          <label>¿Tiene impagos?</label>

          <select
            value={non_payment ? "1" : "0"}
            onChange={(e) => setNonPayment(e.target.value === "1")}
          >
            <option value="0">No</option>
            <option value="1">Sí</option>
          </select>

          {formError && (
            <p className="FormError">{formError}</p>
          )}

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

              {clientEdit ? "Guardar Cambios" : "Guardar Cliente"}

            </button>

          </div>
          

        </form>

      </div>

    </div>
  );
}

export default FormClient;