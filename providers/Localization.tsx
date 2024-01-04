import moment from "moment";
import "moment/min/locales";
import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import { EnResource, ItResource } from "@/assets/Localization";

// Set the key-value pairs for the different languages you want to support.
const translations = {
  it: ItResource,
  en: EnResource,
};
const i18n = new I18n(translations);

// Set the locale once at the beginning of your app.
(i18n.locale = Localization.getLocales()[0].languageCode),
  // When a value is missing from a language it'll fall back to another language with the key present.
  (i18n.enableFallback = true);

// Set the key-value pairs for the different languages you want to support.
i18n.defaultLocale = "en";

export default i18n;

// Example
// import i18n from 'i18n-js';
// i18n.t('login.email')

// Moment.js Settings

moment.locale(Localization.locale);

// moment(1316116057189).fromNow(); // il y a 7 ans

// moment("20111031", "YYYYMMDD").fromNow(); // 9 years ago
// moment("20120620", "YYYYMMDD").fromNow(); // 9 years ago
// moment().startOf('day').fromNow();        // 20 hours ago
// moment().endOf('day').fromNow();          // in 4 hours
// moment().startOf('hour').fromNow();
