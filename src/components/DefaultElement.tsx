import {Fragment} from "react";
import MobileNavBar from "./MobileNavBar";
import LinkReplace from "./LinkReplace";

export default function DefaultElement({element}: {element: JSX.Element}) {
  return <Fragment>{RenderElement(element)}</Fragment>;
}

function RenderElement(element: JSX.Element) {
  return (
    <div className={`flex flex-col h-screen`}>
      <div className="flex flex-row p-4 bg-blue-900">
        <div className="m-auto">
          <LinkReplace
            className="text-2xl whitespace-nowrap text-white font-bold align-middle"
            to={"#"}>
            Madrid Transporte
          </LinkReplace>
        </div>
      </div>
      <div className="overflow-scroll flex flex-col w-full h-full pb-16">
        {element}
      </div>
      <MobileNavBar />
    </div>
  );
}
