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
          background: "linear-gradient(180deg, #d4646e 0%, #c7525c 100%)",
          borderBottomLeftRadius: 18,
          borderBottomRightRadius: 18,
        }}>
        <Toolbar sx={{minHeight: 64, justifyContent: "center"}}>
          <Link
            replace={true}
            className="text-xl whitespace-nowrap text-white font-bold tracking-tight"
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
