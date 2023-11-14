import { Dimensions } from "react-native";
import { PhoneNumberUtil } from "google-libphonenumber";

const phoneUtil = PhoneNumberUtil.getInstance();

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

export function isValidDate(year: number, month: number, day: number): boolean {
  // Funzione per controllare se una data è valida

  // Controllo se l'anno è valido
  if (year < 0) return false;

  // Controllo se il mese è valido
  if (month < 1 || month > 12) return false;

  // Controllo se il giorno è valido
  if (day < 1 || day > 31) return false;

  // Controllo se il giorno è valido per il mese
  if ((month === 4 || month === 6 || month === 9 || month === 11) && day > 30) {
    return false;
  }

  // Controllo se il giorno è valido per il mese di febbraio
  if (month === 2) {
    if (isLeapYear(year)) {
      if (day > 29) return false;
    } else if (day > 28) return false;
  }

  // Se tutti i controlli sono andati a buon fine, la data è valida
  return true;
}

export function isValidPhoneNumber(
  number?: string,
  countryCode?: string
): boolean {
  try {
    const phoneNumber = phoneUtil.parse(number, countryCode);
    return phoneUtil.isValidNumber(phoneNumber);
  } catch (e) {
    return false;
  }
}
