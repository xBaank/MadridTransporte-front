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

export function getFavorite(ttpNumber: string) {
  return getFavorites().find(i => i.ttpNumber === ttpNumber);
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

export const formatTTPNumber = (input: string) => {
  // Remove non-digit characters
  const digitsOnly = input.replace(/\D/g, "");

  // Split the digits into groups
  const groups = [
    digitsOnly.slice(0, 3),
    digitsOnly.slice(3, 6),
    digitsOnly.slice(6, 9),
    digitsOnly.slice(9, 12),
    digitsOnly.slice(12, 22), // The last group with XXXXXXXXXX
  ];

  // Join the groups with spaces
  return groups.join(" ").trim();
};
