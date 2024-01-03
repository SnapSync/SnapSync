import { PhoneNumberUtil } from "google-libphonenumber";

const phoneNumberUtil = PhoneNumberUtil.getInstance();

// Funzione per formatto internazionale E.164
export const formatPhoneNumber = (phoneNumber: string, region?: string) => {
  try {
    const parsedPhoneNumber = phoneNumberUtil.parse(phoneNumber, region);
    return phoneNumberUtil.format(parsedPhoneNumber, 1); // 1 = E164
  } catch (error) {
    return null;
  }
};

// Funzione che dato mi torna il country code
export const getCountryCode = (phoneNumber: string, region?: string) => {
  try {
    const parsedPhoneNumber = phoneNumberUtil.parse(phoneNumber, region);
    return parsedPhoneNumber.getCountryCode();
  } catch (error) {
    return null;
  }
};

// Funzione che verifica se un numero di telefono è valido
export const isValidPhoneNumber = (phoneNumber: string, region?: string) => {
  try {
    const parsedPhoneNumber = phoneNumberUtil.parse(phoneNumber, region);
    return phoneNumberUtil.isValidNumber(parsedPhoneNumber);
  } catch (error) {
    return false;
  }
};

// Funzione che dao un numero di telefono, se è valido, rimuove il + e il country code
export const getNationalNumber = (phoneNumber: string, region?: string) => {
  try {
    const parsedPhoneNumber = phoneNumberUtil.parse(phoneNumber, region);
    return parsedPhoneNumber.getNationalNumber();
  } catch (error) {
    return null;
  }
};
