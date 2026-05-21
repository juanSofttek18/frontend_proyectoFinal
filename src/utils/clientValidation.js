// Regex para nombre/apellido: letras latinas (incluye Ñ, Ç, tildes, diéresis), espacios y guiones
export const NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿÑñÇç][A-Za-zÀ-ÖØ-öø-ÿÑñÇç\s\-]*$/;

// Regex teléfono: + opcional al inicio, solo dígitos, 7-15 caracteres totales
export const PHONE_REGEX = /^\+?\d{7,15}$/;

// Valida NIF (12345678Z) o NIE (X1234567L / Y / Z) — solo estructura, sin algoritmo módulo 23
export function validateNifNie(value) {
  const upper = value.toUpperCase().trim();
  // NIF: 8 dígitos + 1 letra
  const nifRegex = /^\d{8}[A-Z]$/;
  // NIE: X/Y/Z + 7 dígitos + 1 letra
  const nieRegex = /^[XYZ]\d{7}[A-Z]$/;
  return nifRegex.test(upper) || nieRegex.test(upper);
}

// Validación campo a campo para el Formulario de Clientes
export function validateField(field, value) {
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
