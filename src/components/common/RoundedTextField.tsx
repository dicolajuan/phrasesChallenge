import { TextField, TextFieldProps } from "@mui/material";
import React, { useState } from "react";

const baseSxTextfield = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "30px",
    // Estilos para autofill en navegadores basados en WebKit
    '& .MuiOutlinedInput-input:-webkit-autofill': {
      WebkitBoxShadow: "0 0 0 100px #FFFFFF inset",
      WebkitTextFillColor: "#000",
    },
    '& .MuiOutlinedInput-input:-webkit-autofill:focus': {
      WebkitBoxShadow: "0 0 0 100px #FFFFFF inset",
    },
    "& fieldset": {
      borderColor: "#cbcbcb",
    },
    "&:hover fieldset": {
      borderColor: "#cbcbcb",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#6FC5D2",
    },
    // Transición para suavizar el cambio de altura
    transition: "min-height 0.3s ease, max-height 0.3s ease",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#6FC5D2",
  },
  "& .MuiOutlinedInput-notchedOutline legend": {
    marginLeft: "10px",
  },
  // Transición para el área de texto multilinea
  "& .MuiInputBase-inputMultiline": {
    transition: "height 0.3s ease",
  },
};

const RoundedTextField: React.FC<TextFieldProps> = (props) => {
  const { multiline, onFocus, onBlur, sx: sxProp, ...otherProps } = props;
  const isMultiline = Boolean(multiline);

  // Estado para controlar si el campo está enfocado (solo usado en modo multiline)
  const [focused, setFocused] = useState(false);

  // Si es multiline aplicamos estilos dinámicos para cambiar la altura según el foco
  const dynamicSxTextfield = isMultiline
    ? {
        ...baseSxTextfield,
        "& .MuiOutlinedInput-root": {
          ...baseSxTextfield["& .MuiOutlinedInput-root"],
          minHeight: focused ? "100px" : "56px",
          maxHeight: focused ? "100px" : "56px",
        },
        ...sxProp,
      }
    : {
        ...baseSxTextfield,
        ...sxProp,
      };

  // Manejadores de foco y desenfoque. Se actualiza el estado solo si es multiline
  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (isMultiline) {
      setFocused(true);
    }
    if (onFocus) {
      onFocus(e);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (isMultiline) {
      setFocused(false);
    }
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <TextField
      {...otherProps}
      {...(isMultiline ? { multiline: true, rows: focused ? 3 : 1 } : {})}
      sx={dynamicSxTextfield}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
};

export default RoundedTextField;
