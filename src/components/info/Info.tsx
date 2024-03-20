import {Link} from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import ErrorIcon from "@mui/icons-material/Error";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Info() {
  return (
    <div
      className={`grid grid-cols-1 p-5 max-w-md mx-auto w-full justify-center`}>
      <div className={`px-6 py-4`}>
        <div className="font-bold text-xl mb-2">- Sobre este proyecto</div>
        <p className=" text-third text-base">
          Este proyecto no esta afiliado a ninguna empresa de transporte
          publico, ni a ninguna empresa de desarrollo de software.
        </p>
        <br />
        <div className="font-bold text-xl mb-2">- Extraccion de datos</div>
        <p>
          Todos los datos se extraen de Metro de Madrid, EMT Madrid, Renfe y
          CRTM.
        </p>
        <br />
        <div className="font-bold text-xl mb-2">- Problemas</div>
        <p>
          Si encuentras algun problema, puedes reportarlo{" "}
          <Link
            className="border-b"
            to={"https://github.com/xBaank/MadridTransporte/issues/new/choose"}>
            Aqui
          </Link>
        </p>
        <br />
        <div className="font-bold text-xl mb-2">- Codigo Fuente</div>
        <p>
          El codigo fuente puedes encontrarlo{" "}
          <Link
            className="border-b"
            to={"https://github.com/xBaank/MadridTransporte"}>
            Aqui
          </Link>
        </p>
        <br />
        <div className="font-bold text-xl mb-2">- Iconos</div>
        <ul className="mt-3">
          <li>
            <NotificationsIcon className="text-green-500" />
            <span className="text-sm ml-1">
              Notificacion con el tiempo restante cada minuto.
            </span>
          </li>
          <li>
            <MyLocationIcon className="text-blue-600" />
            <span className="text-sm ml-1">
              Ubicacion del autobus en el mapa.
            </span>
          </li>
          <li>
            <ErrorIcon className="text-red-500" />
            <span className="text-sm ml-1">
              Parada afectada por incidencia.
            </span>
          </li>
          <li>
            <FavoriteBorderIcon className="text-red-500" />
            <span className="text-sm ml-1">Añadir a favoritos.</span>
          </li>
          <li>
            <FavoriteIcon className="text-red-500" />
            <DeleteIcon className="text-red-500" />
            <span className="text-sm ml-1">Borrar de favoritos.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
