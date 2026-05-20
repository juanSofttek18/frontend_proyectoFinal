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
  const [firstSurname, setFirstSurname] = useState("");
  const [secondSurname, setSecondSurname] = useState("");
  const [nif, setNif] = useState("");
  const [nationality, setNationality] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [careerTime, setCareerTime] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("EMPLOYED");
  const [phone, setPhone] = useState("");
  const [scoring, setScoring] = useState(0);
  const [nonPayment, setNonPayment] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (clientEdit) {
      setId(clientEdit.id);
      setName(clientEdit.name || "");
      setFirstSurname(clientEdit.firstSurname || clientEdit.first_surname || "");
      setSecondSurname(clientEdit.secondSurname || clientEdit.second_surname || "");
      setNif(clientEdit.nif || "");
      setNationality(clientEdit.nationality || "");
      setBirthdate(clientEdit.birthdate ? clientEdit.birthdate.slice(0, 10) : "");
      setCareerTime(clientEdit.careerTime || clientEdit.career_time ? (clientEdit.careerTime || clientEdit.career_time).slice(0, 10) : "");
      setEmploymentStatus(clientEdit.employmentStatus || clientEdit.employment_status || "EMPLOYED");
      setPhone(clientEdit.phone || "");
      setScoring(clientEdit.scoring ?? 0);
      setNonPayment(clientEdit.nonPayment === 1 || clientEdit.non_payment === 1 || Boolean(clientEdit.non_payment));
      setIsActive(true);
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
    if (!name.trim() || !firstSurname.trim() || !nif.trim() || !nationality.trim() || !birthdate || !careerTime || !phone.trim() || scoring === "" || scoring === null) {
      setFormError("Por favor completa todos los campos obligatorios.");
      return;
    }
    if (Number.isNaN(numericScoring) || numericScoring < 0 || numericScoring > 10) {
      setFormError("El scoring debe estar entre 0 y 10.");
      return;
    }

    setFormError("");

    const clientData = {
      id,
      name,
      firstSurname,
      secondSurname: secondSurname.trim() || null,
      nif,
      nationality,
      birthdate,
      careerTime,
      employmentStatus,
      phone,
      scoring: Number(scoring),
      nonPayment: nonPayment ? 1 : 0,
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
            value={employmentStatus}
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
            value={firstSurname}
            onChange={(e) => setFirstSurname(e.target.value)}
            required
          />

          <label>Segundo apellido</label>

          <input
            type="text"
            value={secondSurname}
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
            value={careerTime}
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
            max="10"
            step="0.1"
          />

          <label>¿Tiene impagos?</label>

          <select
            value={nonPayment ? "1" : "0"}
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
            value={isActive ? "Activo" : "Inactivo"}
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