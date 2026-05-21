import { useState, useEffect } from "react";
import { COUNTRIES } from "../../utils/countries";
import { validateField } from "../../utils/clientValidation";
import "./FormClient.css";

function FormClient({ open, close, saveClient, clientEdit }) {

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

  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (clientEdit) {
      setId(clientEdit.id);
      setName(clientEdit.name || "");
      setFirstSurname(clientEdit.firstSurname || clientEdit.first_surname || "");
      setSecondSurname(clientEdit.secondSurname || clientEdit.second_surname || "");
      setNif(clientEdit.nif || "");
      setNationality(clientEdit.nationality || "");
      setBirthdate(clientEdit.birthdate ? clientEdit.birthdate.slice(0, 10) : "");
      setCareerTime(
        clientEdit.careerTime || clientEdit.career_time
          ? (clientEdit.careerTime || clientEdit.career_time).slice(0, 10)
          : ""
      );
      setEmploymentStatus(clientEdit.employmentStatus || clientEdit.employment_status || "EMPLOYED");
      setPhone(clientEdit.phone || "");
      setScoring(clientEdit.scoring ?? 0);
      setNonPayment(
        clientEdit.nonPayment === 1 ||
        clientEdit.non_payment === 1 ||
        Boolean(clientEdit.non_payment)
      );
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
    setErrors({});
  }, [clientEdit, open]);

  // Actualiza estado + valida en tiempo real
  const handleChange = (field, setter) => (e) => {
    const val = e.target.value;
    setter(val);
    setErrors((prev) => ({ ...prev, [field]: validateField(field, val) }));
  };

  // Manejo especial para NIF: forzar mayúsculas
  const handleNifChange = (e) => {
    const val = e.target.value.toUpperCase();
    setNif(val);
    setErrors((prev) => ({ ...prev, nif: validateField("nif", val) }));
  };

  // Manejo para teléfono: limpiar espacios y guiones al perder el foco
  const handlePhoneBlur = () => {
    const cleaned = phone.replace(/[\s\-]/g, "");
    setPhone(cleaned);
    setErrors((prev) => ({ ...prev, phone: validateField("phone", cleaned) }));
  };

  // ── Submit ─────
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar todos los campos
    const newErrors = {
      name: validateField("name", name),
      firstSurname: validateField("firstSurname", firstSurname),
      secondSurname: validateField("secondSurname", secondSurname),
      nif: validateField("nif", nif),
      nationality: validateField("nationality", nationality),
      birthdate: validateField("birthdate", birthdate),
      careerTime: validateField("careerTime", careerTime),
      phone: validateField("phone", phone),
      scoring: validateField("scoring", scoring),
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((msg) => msg !== "");
    if (hasErrors) return;

    const clientData = {
      id,
      name: name.trim(),
      firstSurname: firstSurname.trim(),
      secondSurname: secondSurname.trim() || null,
      nif: nif.trim().toUpperCase(),
      nationality,
      birthdate,
      careerTime,
      employmentStatus,
      phone: phone.trim(),
      scoring: Number(scoring),
      nonPayment: nonPayment ? 1 : 0,
    };

    saveClient(clientData);
  };

  if (!open) return null;

  return (
    <div className="Modal_Overlay">
      <div className="Modal_Client">

        {/* ── Cabecera ── */}
        <div className="Modal_Header">
          <div>
            <h2>{clientEdit ? "Editar Cliente" : "Añadir Cliente"}</h2>
            <p>Completa la información del cliente</p>
          </div>
          <button type="button" onClick={close}>✕</button>
        </div>

        {/* ── Formulario ── */}
        <form onSubmit={handleSubmit} noValidate>

          {/* Tipo (Estado laboral) */}
          <label htmlFor="fc-employmentStatus">Tipo</label>
          <select
            id="fc-employmentStatus"
            value={employmentStatus}
            onChange={(e) => setEmploymentStatus(e.target.value)}
          >
            <option value="EMPLOYED">Trabajador</option>
            <option value="SELF_EMPLOYED">Trabajador cuenta propia</option>
          </select>

          {/* Nombre */}
          <label htmlFor="fc-name">
            Nombre <span className="required-mark">*</span>
          </label>
          <input
            id="fc-name"
            type="text"
            value={name}
            onChange={handleChange("name", setName)}
            maxLength={60}
            placeholder="Ej: Juan Diego"
            className={errors.name ? "input-error" : ""}
            required
          />
          {errors.name && <span className="FieldError">{errors.name}</span>}

          {/* Primer Apellido */}
          <label htmlFor="fc-firstSurname">
            Primer Apellido <span className="required-mark">*</span>
          </label>
          <input
            id="fc-firstSurname"
            type="text"
            value={firstSurname}
            onChange={handleChange("firstSurname", setFirstSurname)}
            maxLength={60}
            placeholder="Ej: García-Pérez"
            className={errors.firstSurname ? "input-error" : ""}
            required
          />
          {errors.firstSurname && <span className="FieldError">{errors.firstSurname}</span>}

          {/* Segundo Apellido (opcional) */}
          <label htmlFor="fc-secondSurname">
            Segundo Apellido{" "}
            <span className="optional-mark">(opcional)</span>
          </label>
          <input
            id="fc-secondSurname"
            type="text"
            value={secondSurname}
            onChange={handleChange("secondSurname", setSecondSurname)}
            maxLength={60}
            placeholder="Ej: López"
            className={errors.secondSurname ? "input-error" : ""}
          />
          {errors.secondSurname && <span className="FieldError">{errors.secondSurname}</span>}

          {/* NIF / NIE */}
          <label htmlFor="fc-nif">
            NIF / NIE <span className="required-mark">*</span>
          </label>
          <input
            id="fc-nif"
            type="text"
            value={nif}
            onChange={handleNifChange}
            maxLength={9}
            placeholder="Ej: 12345678Z  o  X1234567L"
            className={errors.nif ? "input-error" : ""}
            required
          />
          {errors.nif && <span className="FieldError">{errors.nif}</span>}

          {/* Nacionalidad (select ISO 3166-1 alfa-2) */}
          <label htmlFor="fc-nationality">
            Nacionalidad <span className="required-mark">*</span>
          </label>
          <select
            id="fc-nationality"
            value={nationality}
            onChange={handleChange("nationality", setNationality)}
            className={errors.nationality ? "input-error" : ""}
            required
          >
            <option value="">-- Selecciona un país --</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
          {errors.nationality && <span className="FieldError">{errors.nationality}</span>}

          {/* Fecha de nacimiento */}
          <label htmlFor="fc-birthdate">
            Fecha de nacimiento <span className="required-mark">*</span>
          </label>
          <input
            id="fc-birthdate"
            type="date"
            value={birthdate}
            onChange={handleChange("birthdate", setBirthdate)}
            className={errors.birthdate ? "input-error" : ""}
            required
          />
          {errors.birthdate && <span className="FieldError">{errors.birthdate}</span>}

          {/* Fecha de inicio de carrera */}
          <label htmlFor="fc-careerTime">
            Fecha de inicio de carrera <span className="required-mark">*</span>
          </label>
          <input
            id="fc-careerTime"
            type="date"
            value={careerTime}
            onChange={handleChange("careerTime", setCareerTime)}
            className={errors.careerTime ? "input-error" : ""}
            required
          />
          {errors.careerTime && <span className="FieldError">{errors.careerTime}</span>}

          {/* Teléfono */}
          <label htmlFor="fc-phone">
            Contacto (Teléfono) <span className="required-mark">*</span>
          </label>
          <input
            id="fc-phone"
            type="text"
            value={phone}
            onChange={handleChange("phone", setPhone)}
            onBlur={handlePhoneBlur}
            maxLength={15}
            placeholder="Ej: +34600123456"
            className={errors.phone ? "input-error" : ""}
            required
          />
          {errors.phone && <span className="FieldError">{errors.phone}</span>}

          {/* Scoring */}
          <label htmlFor="fc-scoring">
            Scoring <span className="required-mark">*</span>
          </label>
          <input
            id="fc-scoring"
            type="number"
            value={scoring}
            onChange={handleChange("scoring", setScoring)}
            min="0"
            max="10"
            step="0.1"
            className={errors.scoring ? "input-error" : ""}
            required
          />
          {errors.scoring && <span className="FieldError">{errors.scoring}</span>}

          {/* Impagos */}
          <label htmlFor="fc-nonPayment">¿Tiene impagos?</label>
          <select
            id="fc-nonPayment"
            value={nonPayment ? "1" : "0"}
            onChange={(e) => setNonPayment(e.target.value === "1")}
          >
            <option value="0">No</option>
            <option value="1">Sí</option>
          </select>

          {/* Estado */}
          <label htmlFor="fc-isActive">Estado</label>
          <select
            id="fc-isActive"
            value={isActive ? "Activo" : "Inactivo"}
            onChange={(e) => setIsActive(e.target.value === "Activo")}
          >
            <option>Activo</option>
            <option>Inactivo</option>
          </select>

          {/* Acciones */}
          <div className="Modal_Actions">
            <button type="button" onClick={close}>
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