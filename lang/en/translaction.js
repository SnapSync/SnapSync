import Countries from './countries';

const enTranslactions = {
  continue: 'Continue',

  resend: 'Resend',
  resendIn: 'Resend in {{seconds}}s',

  search: 'Search',
  cancel: 'Cancel',
  block: 'Block',
  delete: 'Delete',

  friends: 'Friends',
  requests: 'Requests',
  suggestions: 'Suggestions',

  // Profile
  profile: {
    friendship: {
      accept: 'Accept',
      deny: 'Reject',
      add: 'Add',
      cancel: 'Cancel request',
      received: '{{username}} wants to be your friend',
    },
    bottomSheetModal: {
      // Per il mio profilo
      editProfile: 'Edit profile',
      settings: 'Settings',
      logout: 'Exit',

      // Per il profilo di un altro utente
      share: 'Share',
      block: 'Block {{username}}',
      unfriend: 'Remove from friends',
      report: 'Report {{username}}',
    }
  },

  // Auth
  auth: {
    privacyPolicyHint: "By tapping \"Continue\", you agree to our Privacy Policy and Terms of Service.",
    usernameHint: "Your username is unique. You can always change it later.",
    fullname: {
      title: "Let's get started, what's your name?",
      placeholder: "Your name",
    },
    dateOfBirth: {
      title: "Hi {{fullname}}, when is your birthday?"
    },
    phoneNumber: {
      title: "Create your account using your phone number",
      placeholder: 'Your phone',
    },
    countryList: {
      title: "Select country",
    },
    otp: {
      title: "Verify your number",
      subtitle: "Verification code sent to {{phoneNumber}}"
    },
    username: {
      title: "Great, create your username",
      placeholder: "Your username",
    }
  },

  // Search
  search: {
    placeholder: "Cerca amici...",
  },

  // outgoingFriendRequests
  outgoingFriendRequests: {
    screenTitle: "Requests sent",
  },

  errors: {
    generic: "An error occurred, try again later.",
    noInternetConnection: "No internet connection.",
    minAge: "Ops! You must be at least {{minAge}} years old to use this app.",
    otpInvalid: "The verification code is invalid.",
    userBanned: "Ops! It seems that your account has been banned.",
    usernameAlreadyExists: "Ops! This username has already been taken.",
    userNotFound: "Ops! This user does not exist.",

    authTokenModal: {
      title: "Ops! Something went wrong.",
      description: "We are unable to access your account. Try again later.",
      userBanned: "It seems that your account has been banned. If you think this is a mistake, please contact us at {{email}}.",
    },

    // Validation
    invalid: "{{field}} is invalid.",
    required: "{{field}} is required.",
    minLenght: "{{field}} must be at least {{minLenght}} characters.",
    maxLenght: "{{field}} must be at most {{maxLenght}} characters.",
    regex: "{{field}} is invalid.",
    min: "{{field}} must be greater than or equal to {{min}}.",
    max: "{{field}} must be less than or equal to {{max}}.",
  },

  fields: {
    fullname: "Fullname",
    dateOfBirth: "Date of birth",
    dayOfBirth: "Day",
    monthOfBirth: "Month",
    yearOfBirth: "Year",
    phoneNumber: "Phone number",
  },

  countries: Countries
}

export default enTranslactions;