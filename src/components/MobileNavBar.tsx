import React, {useEffect, useState} from "react";
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

export default function MobileNavBar() {
  const theme = useTheme();
  const [value, setValue] = useState("Buscar");
  const location = useLocation();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    if (newValue === "Tema") return;
    setValue(newValue);
  };

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/stops/map")) setValue("Mapa");
    else if (path.startsWith("/abono")) setValue("Abono");
    else if (path.startsWith("/settings")) setValue("Ajustes");
    else if (path.startsWith("/info")) setValue("Ajustes");
    else setValue("Buscar");
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
          to={"/"}
          label="Buscar"
          value="Buscar"
          icon={<DirectionsBusIcon />}
        />
        <BottomNavigationAction
          component={Link}
          to={"/stops/map"}
          label="Mapa"
          value="Mapa"
          icon={<MapIcon />}
        />
        <BottomNavigationAction
          component={Link}
          to={"/abono"}
          label="Abono"
          value="Abono"
          icon={<CreditCardIcon />}
        />
        <BottomNavigationAction
          component={Link}
          to={"/settings"}
          label="Ajustes"
          value="Ajustes"
          icon={<SettingsIcon />}
        />
      </BottomNavigation>
    </Paper>
  );
}
