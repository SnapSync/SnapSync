export const AuthFullNameMinLength = 3;
export const AuthFullNameMaxLength = 64;
export const AuthFullNameRegex =
  /^[a-zA-Z][a-zA-Z \u00C0\u00c1\u00c8\u00c9\u00cc\u00cd\u00d2\u00d3\u00d9\u00da\u00e0\u00e1\u00e8\u00e9\u00ec\u00ed\u00f2\u00f3\u00f9\u00fa]*$/;

export const AuthDateOfBirthMinAge = 13;

export const AuthOtpCodeLength = 6;

export const AuthUsernameMinLength = 3;
export const AuthUsernameMaxLength = 30;
export const AuthUsernameRegex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
