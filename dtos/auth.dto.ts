import * as CountyCodesList from "country-codes-list";

export interface AuthDto {
  sessionId?: string;

  fullName?: string; // Nome e cognome
  username: string; // Sarà sempre presente

  phoneNumberVerificationCode?: string; // Codice di verifica del numero di telefono
  phoneNumber?: string;
  // phoneNumberCountryCode?: string;

  phoneNumberCountry?: CountyCodesList.CountryData;

  yearOfBirth: number | null;
  monthOfBirth: number | null;
  dayOfBirth: number | null;
}
