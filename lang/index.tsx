import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import itTranslactions from "./it/translaction.js";
import enTranslactions from "./en/translaction.js";

// Set the key-value pairs for the different languages you want to support.
const translations = {
  it: itTranslactions,
  // en: enTranslactions,
};

const i18n = new I18n(translations);

// Set the locale once at the beginning of your app.
i18n.locale = Localization.getLocales()[0].languageCode;

i18n.enableFallback = process.env.NODE_ENV === "production" ? true : false; // In sviluppo la metto a false per vedere se le traduzioni sono corrette

export default i18n;
