import MobileNavBar from "./MobileNavBar";
import {Link} from "react-router-dom";

export default function DefaultElement({element}: {element: JSX.Element}) {
  return (
    <div className={`flex flex-col h-screen`}>
      <div className="flex flex-row p-4 bg-blue-900">
        <div className="m-auto">
          <Link
            replace={true}
            className="text-2xl whitespace-nowrap text-white font-bold align-middle"
            to={"#"}>
            Madrid Transporte
          </Link>
        </div>
      </div>
      <div className="overflow-scroll flex flex-col w-full h-full pb-16">
        {element}
      </div>
      <MobileNavBar />
    </div>
  );
}
