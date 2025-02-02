import { TextField, TextFieldProps } from "@mui/material";

import React from "react";

const sxTextfield = {
  "& .MuiOutlinedInput-root": {
    minHeight: "56px",
    maxHeight: "100px",
    borderRadius: "30px",

    '& .MuiOutlinedInput-input:-webkit-autofill': { // Especifica para Chrome y otros navegadores basados en WebKit
      WebkitBoxShadow: '0 0 0 100px #FFFFFF inset', // Cambia el color #FFFFFF al color de fondo deseado
      WebkitTextFillColor: '#000', // Cambia #000 al color del texto deseado
    },
    '& .MuiOutlinedInput-input:-webkit-autofill:focus': { // Especifica para el estado de enfoque
      WebkitBoxShadow: '0 0 0 100px #FFFFFF inset', // Asegúrate de coincidir con el color de fondo no enfocado
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
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#6FC5D2",
  },
  "& .MuiOutlinedInput-notchedOutline legend": {
    marginLeft: "10px",
  },
};

const RoundedTextField: React.FC<TextFieldProps> = (props) => {
  const sx = {
    ...sxTextfield,
    ...props.sx,
  };

  const InputLabelPropsReceived = {
    ...props.InputLabelProps,
    shrink: true,
    style: { ...props.InputLabelProps?.style, left: "10px" },
}

  return (
    <TextField
      {...props}
      sx={sx}
      InputLabelProps={InputLabelPropsReceived}
    />
  );
};

export default RoundedTextField;
