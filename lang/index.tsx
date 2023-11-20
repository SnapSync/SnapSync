import * as Localization from "expo-localization";
import { I18n } from "i18n-js";

// Set the key-value pairs for the different languages you want to support.
const translations = {
  en: {
    continue: "continue",
    resend: "resend",
    resendIn: "resend in {{seconds}}s",
    login: "login",
    signup: "signup",
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
        changeNumber: "Change the phone number",
      },

      username: {
        title: "Last step, choose a username",
        subtitle:
          "Your username is unique. It will be used to create your profile link. You can change it later.",
      },
    },

    home: {
      modalBannedUser: {
        title: "Ops! Your account has been banned",
        body: "You can't use SnapSync because your account did not follow our Community Guidelines. If you think this is a mistake, please contact us.",
      },
      modalAuth: {
        title: "Ops! Something went wrong",
        body: "We were unable to verify your account. Please try again.",
      },
    },

    errors: {
      unprocessableEntityTitle: "Ops! Something went wrong",
      notAuthorizedTitle: "Ops! Something went wrong",
      generic: "Ops! Something went wrong",
      unableToGetSession: "We were unable to retrieve the session",
      deviceNotFound: "We were unable to find your device",
      noInternetConnection:
        "There is no internet connection. Please try again later.",

      required: "{{field}} is required",
      minLenght: "{{field}} must be at least {{minLenght}} characters long",
      maxLenght: "{{field}} must be at most {{maxLenght}} characters long",
      regex: "{{field}} is not valid",

      minAge:
        "You must be at least {{minAge}} years old to use the application",

      invalid: "{{field}} is not valid",

      usernameAlreadyExists: "This username is already in use. Try another one",
      usernameOrPhoneAlreadyExists:
        "This username or phone number is already in use.",
    },
    fields: {
      fullname: "fullname",

      dateOfBirth: "date of birth",
      dayOfBirth: "day of birth",
      monthOfBirth: "month of birth",
      yearOfBirth: "year of birth",

      phoneNumber: "phone number",

      username: "username",
    },
  },
};

const i18n = new I18n(translations);

// Set the locale once at the beginning of your app.
i18n.locale = "en"; // Localization.getLocales()[0].languageCode;

i18n.enableFallback = process.env.NODE_ENV === "production" ? true : false; // In sviluppo la metto a false per vedere se le traduzioni sono corrette

export default i18n;
