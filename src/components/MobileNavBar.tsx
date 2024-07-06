import React, {useEffect, useState} from "react";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import {BottomNavigation, BottomNavigationAction, Paper} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import SettingsIcon from "@mui/icons-material/Settings";
import {Link, useLocation} from "react-router-dom";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import {Capacitor} from "@capacitor/core";
import {useTranslation} from "react-i18next";

export default function MobileNavBar() {
  const getLocation = () => {
    const path = location.pathname;
    if (path.startsWith("/stops/map")) {
      return "Mapa";
    } else if (path.startsWith("/abono")) {
      return "Abono";
    } else if (path.startsWith("/settings")) {
      return "Ajustes";
    } else if (path.startsWith("/info")) {
      return "Ajustes";
    } else {
      return "Buscar";
    }
  };

  const {t} = useTranslation();
  const location = useLocation();
  const [value, setValue] = useState<"Mapa" | "Abono" | "Ajustes" | "Buscar">(
    getLocation(),
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

  useEffect(() => setValue(getLocation()), [location]);

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
          label={t("navbar.search")}
          value="Buscar"
          icon={<DirectionsBusIcon />}
        />
        <BottomNavigationAction
          component={Link}
          to={"/stops/map"}
          label={t("navbar.map")}
          value="Mapa"
          icon={<MapIcon />}
        />
        {Capacitor.getPlatform() === "android" ? (
          <BottomNavigationAction
            component={Link}
            to={"/abonoNFC"}
            label={t("navbar.travelPass")}
            value="Abono"
            icon={<CreditCardIcon />}
          />
        ) : null}

        <BottomNavigationAction
          component={Link}
          to={"/settings"}
          label={t("navbar.settings")}
          value="Ajustes"
          icon={<SettingsIcon />}
        />
      </BottomNavigation>
    </Paper>
  );
}
