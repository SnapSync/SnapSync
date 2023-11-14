export interface AuthDto {
  sessionId?: string;

  fullName?: string; // Nome e cognome
  username: string; // Sarà sempre presente

  phoneNumberVerificationCode?: string; // Codice di verifica del numero di telefono
  phoneNumber?: string;
  phoneNumberFormatted?: string;
  phoneNumberCountryCode?: string;

  yearOfBirth: number | null;
  monthOfBirth: number | null;
  dayOfBirth: number | null;
}
