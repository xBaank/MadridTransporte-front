import {Search, CreditCard} from "@mui/icons-material";
import {Button, InputAdornment, TextField} from "@mui/material";
import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import AbonoFavorites from "./AbonosFavorites";
import {formatTTPNumber, getAbonoRoute} from "./api/Utils";

export default function AbonoSearch() {
  const navigate = useNavigate();
  const [formattedValue, setFormattedValue] = useState<string | undefined>("");
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const abonoCode = (
      e.currentTarget.AbonoCode.value as string | undefined
    )?.replace(/\s/g, "");

    if (abonoCode === undefined) {
      setError("Introduzca un codigo");
      return;
    }
    if (abonoCode.length < 22) {
      setError("El codigo debe tener al menos 22 digitos");
      return;
    }
    if (isNaN(abonoCode as unknown as number)) {
      setError("El codigo solo puede contener numeros");
      return;
    }
    navigate(getAbonoRoute(abonoCode));
  };

  const handleChange = (event: any) => {
    const inputValue = event.target.value;
    if (inputValue === "") {
      setFormattedValue(undefined);
      return;
    }
    const formattedInput = formatTTPNumber(inputValue);
    setFormattedValue(formattedInput);
  };

  return (
    <div>
      <div className="grid grid-cols-1 p-5 max-w-md mx-auto justify-center">
        <div className=" font-bold text-2xl pb-4">Buscar abono</div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 grid">
            <TextField
              id="StopCode"
              value={formattedValue}
              onChange={handleChange}
              name="AbonoCode"
              label="Introduzca el numero completo"
              placeholder="001 000 000 001 XXXXXXXXXX"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CreditCard color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            {error !== null ? (
              <div className="text-red-500">{error}</div>
            ) : null}
          </div>
          {window.nfc === undefined ? null : (
            <Button
              component={Link}
              fullWidth
              to="/abonoNFC"
              variant="contained">
              Escaneo por NFC
            </Button>
          )}
        </form>
        {AbonoFavorites()}
      </div>
    </div>
  );
}
