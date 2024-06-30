import NotificationsIcon from "@mui/icons-material/Notifications";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import ErrorIcon from "@mui/icons-material/Error";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import MapIcon from "@mui/icons-material/Map";
import AccessibleIcon from "@mui/icons-material/Accessible";
import {useTranslation} from "react-i18next";
import {Button} from "@mui/material";
import {Link} from "react-router-dom";

export default function Info() {
  const {t} = useTranslation();
  return (
    <div
      className={`grid grid-cols-1 p-5 max-w-md mx-auto w-full justify-center`}>
      <div className={`px-6 py-4`}>
        <div className="font-bold text-xl mb-2">
          - {t("moreInfo.about.title")}
        </div>
        <p className=" text-third text-base">{t("moreInfo.about.body")}</p>
        <br />
        <div className="font-bold text-xl mb-2">
          - {t("moreInfo.extraction.title")}
        </div>
        <p>{t("moreInfo.extraction.body")}</p>
        <br />
        <div className="font-bold text-xl mb-2">
          - {t("moreInfo.problems.title")}
        </div>
        <div className="w-full flex justify-center mt-2">
          <Button
            variant="outlined"
            component={Link}
            className=" w-full"
            to={"https://github.com/xBaank/MadridTransporte/issues/new/choose"}>
            {t("moreInfo.problems.button")}
          </Button>
        </div>
        <br />
        <div className="font-bold text-xl mb-2">
          - {t("moreInfo.sourceCode.title")}
        </div>
        <div className="w-full flex justify-center mt-2">
          <Button
            variant="outlined"
            component={Link}
            className=" w-full"
            to={"https://github.com/xBaank/MadridTransporte"}>
            {t("moreInfo.sourceCode.button")}
          </Button>
        </div>
        <br />
        <div className="font-bold text-xl mb-2">
          - {t("moreInfo.icons.title")}
        </div>
        <ul className="mt-3">
          <li>
            <NotificationsIcon className="text-green-500" />
            <span className="text-sm ml-1">
              {t("moreInfo.icons.notification")}
            </span>
          </li>
          <li>
            <MapIcon color="primary" />
            <span className="text-sm ml-1">{t("moreInfo.icons.map")}</span>
          </li>
          <li>
            <AccessibleIcon color="primary" />
            <span className="text-sm ml-1">
              {t("moreInfo.icons.accessibility")}
            </span>
          </li>
          <li>
            <MyLocationIcon className="text-blue-600" />
            <span className="text-sm ml-1">{t("moreInfo.icons.location")}</span>
          </li>
          <li>
            <ErrorIcon className="text-red-500" />
            <span className="text-sm ml-1">{t("moreInfo.icons.incident")}</span>
          </li>
          <li>
            <FavoriteBorderIcon className="text-red-500" />
            <span className="text-sm ml-1">
              {t("moreInfo.icons.favorites")}
            </span>
          </li>
          <li>
            <FavoriteIcon className="text-red-500" />
            <DeleteIcon className="text-red-500" />
            <span className="text-sm ml-1">{t("moreInfo.icons.delete")}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
