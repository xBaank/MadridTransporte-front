import {AppBar, Toolbar} from "@mui/material";
import MobileNavBar from "./MobileNavBar";
import {Link} from "react-router-dom";
import {JSX} from "react";
const isDev = import.meta.env.DEV;

export default function DefaultElement({element}: {element: JSX.Element}) {
  return (
    <div className="flex flex-col h-screen bg-[#f5f6f8] dark:bg-[#0f1114]">
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: theme => theme.palette.background.paper,
          color: "text.primary",
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}>
        <Toolbar sx={{minHeight: 64, justifyContent: "center"}}>
          <Link
            replace={true}
            className="text-xl whitespace-nowrap font-bold tracking-tight text-gray-900 dark:text-white"
            to={"#"}>
            Madrid Transporte{isDev ? " Dev" : ""}
          </Link>
        </Toolbar>
      </AppBar>
      <div className="overflow-scroll no-scrollbar flex flex-col w-full h-full pb-20">
        {element}
      </div>
      <MobileNavBar />
    </div>
  );
}
