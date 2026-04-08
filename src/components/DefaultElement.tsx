import {AppBar, Box, Toolbar, Typography} from "@mui/material";
import MobileNavBar from "./MobileNavBar";
import {Link} from "react-router-dom";
import {JSX} from "react";
const isDev = import.meta.env.DEV;

export default function DefaultElement({element}: {element: JSX.Element}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "background.default",
      }}>
      <AppBar
        position="static"
        sx={{paddingTop: "env(safe-area-inset-top)"}}>
        <Toolbar sx={{minHeight: 60, justifyContent: "center", gap: 1.5}}>
          <Box
            component={Link}
            replace
            to={"#"}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              textDecoration: "none",
              color: "text.primary",
            }}>
            <Typography
              variant="h6"
              sx={{fontWeight: 700, letterSpacing: "-0.01em"}}>
              Madrid Transporte{isDev ? " Dev" : ""}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        className="no-scrollbar"
        sx={{
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          flex: 1,
          pb: "calc(68px + env(safe-area-inset-bottom))",
        }}>
        {element}
      </Box>
      <MobileNavBar />
    </Box>
  );
}
