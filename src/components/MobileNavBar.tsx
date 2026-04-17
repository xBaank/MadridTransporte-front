import React, {useEffect, useState} from "react";
import HomeIcon from "@mui/icons-material/Home";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import {BottomNavigation, BottomNavigationAction, Paper} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import {Link, useLocation} from "react-router-dom";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import {Capacitor} from "@capacitor/core";
import {useTranslation} from "react-i18next";

type NavValue = "Mapa" | "Abono" | "Ajustes" | "Buscar";

export default function MobileNavBar() {
  const getLocation = (): NavValue => {
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
  const [value, setValue] = useState<NavValue>(getLocation());

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
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

  const activeColor = "#d4646e";

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderTop: "1px solid",
        borderColor: "divider",
      }}
      elevation={8}>
      <BottomNavigation
        value={value}
        onChange={handleChange}
        sx={{
          height: 70,
          background: "transparent",
          "& .MuiBottomNavigationAction-root.Mui-selected": {
            color: activeColor,
          },
          "& .MuiBottomNavigationAction-root": {
            minWidth: 0,
            padding: "6px 0",
          },
          "& .MuiBottomNavigationAction-label": {
            fontSize: "0.72rem",
            fontWeight: 500,
          },
          "& .MuiBottomNavigationAction-label.Mui-selected": {
            fontSize: "0.78rem",
            fontWeight: 700,
          },
        }}
        className="pb-1">
        <BottomNavigationAction
          component={Link}
          to={"/"}
          label={t("navbar.search")}
          value="Buscar"
          icon={value === "Buscar" ? <HomeIcon /> : <HomeOutlinedIcon />}
        />
        <BottomNavigationAction
          component={Link}
          to={"/stops/map"}
          label={t("navbar.map")}
          value="Mapa"
          icon={value === "Mapa" ? <MapIcon /> : <MapOutlinedIcon />}
        />
        {Capacitor.getPlatform() === "android" ? (
          <BottomNavigationAction
            component={Link}
            to={"/abonoNFC"}
            label={t("navbar.travelPass")}
            value="Abono"
            icon={
              value === "Abono" ? (
                <CreditCardIcon />
              ) : (
                <CreditCardOutlinedIcon />
              )
            }
          />
        ) : null}

        <BottomNavigationAction
          component={Link}
          to={"/settings"}
          label={t("navbar.settings")}
          value="Ajustes"
          icon={
            value === "Ajustes" ? <SettingsIcon /> : <SettingsOutlinedIcon />
          }
        />
      </BottomNavigation>
    </Paper>
  );
}
