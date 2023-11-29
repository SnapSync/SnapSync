import { Dimensions } from "react-native";

export const SCREEN_WIDTH = Dimensions.get("window").width;
export const SCREEN_HEIGHT = Dimensions.get("window").height;
export const SCREEN_HORIENTATION =
  SCREEN_WIDTH > SCREEN_HEIGHT ? "LANDSCAPE" : "PORTRAIT";

export function isPortrait() {
  return SCREEN_HORIENTATION === "PORTRAIT";
}

// Funzione per controllare se un anno è bisestile
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}
