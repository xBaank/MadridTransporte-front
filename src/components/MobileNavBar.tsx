import React, {createContext, useContext, useEffect, useState} from "react";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  useTheme,
} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import SettingsIcon from "@mui/icons-material/Settings";
import {Link, useLocation} from "react-router-dom";
import CreditCardIcon from "@mui/icons-material/CreditCard";

export const MenuContext = createContext({
  buscar: "/",
  mapa: "/stops/map",
  abono: "/abono",
  ajustes: "/settings",
});

export default function MobileNavBar() {
  const theme = useTheme();
  const location = useLocation();
  const menuContext = useContext(MenuContext);
  const [value, setValue] = useState<"Mapa" | "Abono" | "Ajustes" | "Buscar">(
    "Buscar",
  );

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    if (
      newValue !== "Mapa" &&
      newValue !== "Abono" &&
      newValue !== "Ajustes" &&
      newValue !== "Buscar"
    )
      return;
    setValue(newValue);
  };

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/stops/map")) {
      setValue("Mapa");
      menuContext.mapa = path;
    } else if (path.startsWith("/abono")) {
      setValue("Abono");
      menuContext.abono = path;
    } else if (path.startsWith("/settings")) {
      setValue("Ajustes");
      menuContext.ajustes = path;
    } else if (path.startsWith("/info")) {
      setValue("Ajustes");
      menuContext.ajustes = path;
    } else {
      setValue("Buscar");
      menuContext.buscar = path;
    }
    console.log(menuContext);
  }, [location]);

  useEffect(() => {
    localStorage.setItem("theme", theme.palette.mode);
  }, [theme.palette.mode]);

  return (
    <Paper sx={{position: "fixed", bottom: 0, left: 0, right: 0}} elevation={3}>
      <BottomNavigation
        value={value}
        onChange={handleChange}
        style={{height: 70}}
        className="pb-1">
        <BottomNavigationAction
          component={Link}
          to={menuContext.buscar}
          label="Buscar"
          value="Buscar"
          icon={<DirectionsBusIcon />}
        />
        <BottomNavigationAction
          component={Link}
          to={menuContext.mapa}
          label="Mapa"
          value="Mapa"
          icon={<MapIcon />}
        />
        <BottomNavigationAction
          component={Link}
          to={menuContext.abono}
          label="Abono"
          value="Abono"
          icon={<CreditCardIcon />}
        />
        <BottomNavigationAction
          component={Link}
          to={menuContext.ajustes}
          label="Ajustes"
          value="Ajustes"
          icon={<SettingsIcon />}
        />
      </BottomNavigation>
    </Paper>
  );
}
