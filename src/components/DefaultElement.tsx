import React, { Fragment } from "react"
import AppNavBar from "./AppNavBar"
import MobileNavBar from "./MobileNavBar"
import useWindowDimensions from "./WindowDimensions"
import { Link } from "react-router-dom"

export default function DefaultElement({ element }: { element: JSX.Element }) {
  return (
    <Fragment>
      {RenderElement(element)}
    </Fragment >
  )
}

function RenderElement(element: JSX.Element) {
  const { width } = useWindowDimensions()
  const isMobile = width < 825

  return (
    <div className={`flex flex-col h-screen`}>
      {
        !isMobile ?
          <>
            <AppNavBar />
            {element}
          </>
          :
          <>
            <div className="flex flex-row p-4 bg-blue-900">
              <div className='m-auto'>
                <Link className='text-2xl whitespace-nowrap text-white font-bold align-middle' to={"/"}>
                  Madrid Transporte
                </Link>
              </div>
            </div>
            <div className="overflow-scroll flex flex-col w-full h-full pb-16">
              {element}
            </div>
            <MobileNavBar />
          </>
      }
    </div>
  )
}