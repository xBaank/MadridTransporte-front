import {AppBar} from "@mui/material";
import MobileNavBar from "./MobileNavBar";
import {Link} from "react-router-dom";
import {JSX} from "react";
const isDev = import.meta.env.DEV;

export default function DefaultElement({element}: {element: JSX.Element}) {
  return (
    <div className={`flex flex-col h-screen`}>
      <AppBar position="static">
        <div className="flex flex-row p-4">
          <div className="m-auto">
            <Link
              replace={true}
              className="text-2xl whitespace-nowrap text-white font-bold align-middle"
              to={"#"}>
              Madrid Transporte {isDev ? " Dev " : ""}
            </Link>
          </div>
        </div>
      </AppBar>
      <div className="overflow-scroll no-scrollbar flex flex-col w-full h-full pb-16">
        {element}
      </div>
      <MobileNavBar />
    </div>
  );
}
