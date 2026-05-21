import { useState, useEffect } from "react";
import "./FormClient.css";

// ─── Países ISO 3166-1 alfa-2 (lista reducida pero representativa) ───────────
const COUNTRIES = [
  { code: "AF", name: "Afganistán" },
  { code: "AL", name: "Albania" },
  { code: "DE", name: "Alemania" },
  { code: "AD", name: "Andorra" },
  { code: "AO", name: "Angola" },
  { code: "SA", name: "Arabia Saudita" },
  { code: "DZ", name: "Argelia" },
  { code: "AR", name: "Argentina" },
  { code: "AM", name: "Armenia" },
  { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" },
  { code: "AZ", name: "Azerbaiyán" },
  { code: "BS", name: "Bahamas" },
  { code: "BD", name: "Bangladés" },
  { code: "BE", name: "Bélgica" },
  { code: "BZ", name: "Belice" },
  { code: "BO", name: "Bolivia" },
  { code: "BA", name: "Bosnia y Herzegovina" },
  { code: "BR", name: "Brasil" },
  { code: "BG", name: "Bulgaria" },
  { code: "CA", name: "Canadá" },
  { code: "CL", name: "Chile" },
  { code: "CN", name: "China" },
  { code: "CO", name: "Colombia" },
  { code: "KR", name: "Corea del Sur" },
  { code: "CR", name: "Costa Rica" },
  { code: "HR", name: "Croacia" },
  { code: "CU", name: "Cuba" },
  { code: "DK", name: "Dinamarca" },
  { code: "EC", name: "Ecuador" },
  { code: "EG", name: "Egipto" },
  { code: "SV", name: "El Salvador" },
  { code: "AE", name: "Emiratos Árabes Unidos" },
  { code: "SK", name: "Eslovaquia" },
  { code: "SI", name: "Eslovenia" },
  { code: "ES", name: "España" },
  { code: "US", name: "Estados Unidos" },
  { code: "EE", name: "Estonia" },
  { code: "ET", name: "Etiopía" },
  { code: "PH", name: "Filipinas" },
  { code: "FI", name: "Finlandia" },
  { code: "FR", name: "Francia" },
  { code: "GE", name: "Georgia" },
  { code: "GH", name: "Ghana" },
  { code: "GR", name: "Grecia" },
  { code: "GT", name: "Guatemala" },
  { code: "HN", name: "Honduras" },
  { code: "HU", name: "Hungría" },
  { code: "IN", name: "India" },
  { code: "ID", name: "Indonesia" },
  { code: "IQ", name: "Irak" },
  { code: "IR", name: "Irán" },
  { code: "IE", name: "Irlanda" },
  { code: "IS", name: "Islandia" },
  { code: "IL", name: "Israel" },
  { code: "IT", name: "Italia" },
  { code: "JM", name: "Jamaica" },
  { code: "JP", name: "Japón" },
  { code: "JO", name: "Jordania" },
  { code: "KZ", name: "Kazajistán" },
  { code: "KE", name: "Kenia" },
  { code: "KW", name: "Kuwait" },
  { code: "LV", name: "Letonia" },
  { code: "LB", name: "Líbano" },
  { code: "LY", name: "Libia" },
  { code: "LT", name: "Lituania" },
  { code: "LU", name: "Luxemburgo" },
  { code: "MK", name: "Macedonia del Norte" },
  { code: "MY", name: "Malasia" },
  { code: "MA", name: "Marruecos" },
  { code: "MX", name: "México" },
  { code: "MD", name: "Moldavia" },
  { code: "MN", name: "Mongolia" },
  { code: "ME", name: "Montenegro" },
  { code: "MZ", name: "Mozambique" },
  { code: "NA", name: "Namibia" },
  { code: "NP", name: "Nepal" },
  { code: "NI", name: "Nicaragua" },
  { code: "NG", name: "Nigeria" },
  { code: "NO", name: "Noruega" },
  { code: "NZ", name: "Nueva Zelanda" },
  { code: "NL", name: "Países Bajos" },
  { code: "PK", name: "Pakistán" },
  { code: "PA", name: "Panamá" },
  { code: "PY", name: "Paraguay" },
  { code: "PE", name: "Perú" },
  { code: "PL", name: "Polonia" },
  { code: "PT", name: "Portugal" },
  { code: "QA", name: "Qatar" },
  { code: "GB", name: "Reino Unido" },
  { code: "CZ", name: "República Checa" },
  { code: "DO", name: "República Dominicana" },
  { code: "RO", name: "Rumanía" },
  { code: "RU", name: "Rusia" },
  { code: "RS", name: "Serbia" },
  { code: "SG", name: "Singapur" },
  { code: "SY", name: "Siria" },
  { code: "SO", name: "Somalia" },
  { code: "LK", name: "Sri Lanka" },
  { code: "SE", name: "Suecia" },
  { code: "CH", name: "Suiza" },
  { code: "TH", name: "Tailandia" },
  { code: "TZ", name: "Tanzania" },
  { code: "TN", name: "Túnez" },
  { code: "TR", name: "Turquía" },
  { code: "UA", name: "Ucrania" },
  { code: "UG", name: "Uganda" },
  { code: "UY", name: "Uruguay" },
  { code: "VE", name: "Venezuela" },
  { code: "VN", name: "Vietnam" },
  { code: "YE", name: "Yemen" },
  { code: "ZA", name: "Sudáfrica" },
  { code: "ZW", name: "Zimbabue" },
];

// Valida NIF (12345678Z) o NIE (X1234567L / Y / Z) — solo estructura, sin algoritmo módulo 23
function validateNifNie(value) {
  const upper = value.toUpperCase().trim();
  // NIF: 8 dígitos + 1 letra
  const nifRegex = /^\d{8}[A-Z]$/;
  // NIE: X/Y/Z + 7 dígitos + 1 letra
  const nieRegex = /^[XYZ]\d{7}[A-Z]$/;
  return nifRegex.test(upper) || nieRegex.test(upper);
}

// Regex para nombre/apellido: letras latinas (incluye Ñ, Ç, tildes, diéresis), espacios y guiones
const NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿÑñÇç][A-Za-zÀ-ÖØ-öø-ÿÑñÇç\s\-]*$/;

// Regex teléfono: + opcional al inicio, solo dígitos, 7-15 caracteres totales
const PHONE_REGEX = /^\+?\d{7,15}$/;

// ─── Componente ──────────────────────────────────────────────────────────────
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

  // Errores por campo
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

  // ── Validación campo a campo ────────────────────────────────────────────────
  function validateField(field, value) {
    switch (field) {
      case "name":
        if (!value.trim()) return "El nombre es obligatorio.";
        if (!NAME_REGEX.test(value.trim()))
          return "Solo se permiten letras, espacios y guiones. Sin números ni caracteres especiales.";
        if (value.trim().length > 60)
          return "El nombre no puede superar los 60 caracteres.";
        return "";

      case "firstSurname":
        if (!value.trim()) return "El primer apellido es obligatorio.";
        if (!NAME_REGEX.test(value.trim()))
          return "Solo se permiten letras, espacios y guiones. Sin números ni caracteres especiales.";
        if (value.trim().length > 60)
          return "El primer apellido no puede superar los 60 caracteres.";
        return "";

      case "secondSurname":
        // Opcional: si está vacío es válido
        if (!value.trim()) return "";
        if (!NAME_REGEX.test(value.trim()))
          return "Solo se permiten letras, espacios y guiones. Sin números ni caracteres especiales.";
        if (value.trim().length > 60)
          return "El segundo apellido no puede superar los 60 caracteres.";
        return "";

      case "nif":
        if (!value.trim()) return "El NIF/NIE es obligatorio.";
        if (!validateNifNie(value))
          return "NIF/NIE inválido. Formato: 12345678Z (NIF) o X1234567L (NIE).";
        return "";

      case "nationality":
        if (!value) return "La nacionalidad es obligatoria.";
        return "";

      case "birthdate": {
        if (!value) return "La fecha de nacimiento es obligatoria.";
        const birth = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
          age--;
        }
        if (age < 18) return "El cliente debe ser mayor de edad (mínimo 18 años).";
        return "";
      }

      case "careerTime":
        if (!value) return "La fecha de inicio de carrera es obligatoria.";
        return "";

      case "phone":
        if (!value.trim()) return "El teléfono es obligatorio.";
        if (!PHONE_REGEX.test(value.trim()))
          return "Teléfono inválido. Usa solo dígitos (7-15). Puedes añadir + al inicio (ej. +34600123456).";
        return "";

      case "scoring": {
        const n = Number(value);
        if (value === "" || value === null) return "El scoring es obligatorio.";
        if (Number.isNaN(n) || n < 0 || n > 10)
          return "El scoring debe estar entre 0 y 10.";
        return "";
      }

      default:
        return "";
    }
  }

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

  // Manejo especial para teléfono: limpiar espacios y guiones al perder el foco
  const handlePhoneBlur = () => {
    const cleaned = phone.replace(/[\s\-]/g, "");
    setPhone(cleaned);
    setErrors((prev) => ({ ...prev, phone: validateField("phone", cleaned) }));
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
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