import {type FavoriteAbono} from "./Types";

export const AbonoIcon = "/icons/TTP.jpeg";

export function getFavorites(): FavoriteAbono[] {
  const favorites = localStorage.getItem("abonosFavorites");
  if (favorites === null) return [];
  return JSON.parse(favorites);
}

export function addToFavorites(abono: FavoriteAbono) {
  const favorites = JSON.parse(localStorage.getItem("abonosFavorites") ?? "[]");
  localStorage.setItem(
    "abonosFavorites",
    JSON.stringify([...favorites, abono]),
  );
}

export function removeFromFavorites({ttpNumber}: {ttpNumber: string}) {
  const favorites = JSON.parse(localStorage.getItem("abonosFavorites") ?? "[]");
  localStorage.setItem(
    "abonosFavorites",
    JSON.stringify(
      favorites.filter(
        (favorite: FavoriteAbono) => favorite.ttpNumber !== ttpNumber,
      ),
    ),
  );
}

export function getAbonoRoute(ttpNumber: string) {
  return `/abono/${ttpNumber}`;
}
