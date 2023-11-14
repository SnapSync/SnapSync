import * as Localization from "expo-localization";
import { I18n } from "i18n-js";

// Set the key-value pairs for the different languages you want to support.
const translations = {
  en: {
    continue: "continue",
    resend: "resend",
    auth: {
      fullname: {
        title: "Let's start, what's your name?",
        subtitle: "Enter your name to help people find your profile.",
      },
      dateOfBirth: {
        title: "Hi {{fullName}}, when were you born?",
        subtitle:
          "We use this data to verify that you are the minimum age to use the application.",
      },
      phoneNumber: {
        title: "We're almost there, enter your phone number",
        subtitle:
          "Sign in or create your account using your phone number. No one will be able to see it from your profile.",
      },

      otp: {
        title: "Check your messages",
        subtitle:
          "We sent you a text message with a code to verify your phone number.",
        notReceived: "Didn't you receive the code?",
      },
    },

    errors: {
      unprocessableEntityTitle: "Ops! Something went wrong",
      generic: "Ops! Something went wrong",
      unableToGetSession: "Ops! We were unable to retrieve the session",
      deviceNotFound: "Ops! We were unable to find your device",

      required: "{{field}} is required",
      minLenght: "{{field}} must be at least {{minLenght}} characters long",
      maxLenght: "{{field}} must be at most {{maxLenght}} characters long",
      regex: "{{field}} is not valid",

      minAge:
        "You must be at least {{minAge}} years old to use the application",

      invalid: "{{field}} is not valid",
    },
    fields: {
      fullname: "fullname",

      dateOfBirth: "date of birth",
      dayOfBirth: "day of birth",
      monthOfBirth: "month of birth",
      yearOfBirth: "year of birth",

      phoneNumber: "phone number",
    },
  },
};

const i18n = new I18n(translations);

// Set the locale once at the beginning of your app.
i18n.locale = "en"; // Localization.getLocales()[0].languageCode;

i18n.enableFallback = process.env.NODE_ENV === "production" ? true : false; // In sviluppo la metto a false per vedere se le traduzioni sono corrette

export default i18n;
