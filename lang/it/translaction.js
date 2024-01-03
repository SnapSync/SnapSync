import Countries from './countries';

const itTranslactions = {
  continue: 'Continua',
  save: 'Salva',

  resend: 'Reinvia',
  resendIn: 'Reinvia in {{seconds}}s',

  search: 'Cerca',
  cancel: 'Annulla',
  block: 'Blocca',
  unblock: 'Sblocca',
  delete: 'Elimina',
  remove: 'Rimuovi',
  clear: 'Svuota',
  seeAll: 'Vedi tutti',
  accept: 'Accetta',
  add: 'Aggiungi',
  reject: 'Rifiuta',
  ok: 'Ok',

  streak: 'Streak',

  friends: 'Amici',
  friendsCount: {
    zero: 'Amici',
    one: '{{count}} amico',
    other: '{{count}} amici',
  },
  incomingFriendRequests: 'Chi mi ha aggiunto',
  outgoingFriendRequests: 'Richieste inviate',
  suggestionsForYou: 'Suggerimenti per te',
  othersResults: 'Altri risultati',
  requests: 'Richieste',
  suggestions: 'Per te',
  mutualFriends: {
    zero: 'Nessun amico in comune',
    one: '{{count}} amico in comune',
    other: '{{count}} amici in comune',

  },
  snaps: 'Snaps',

  exit: 'Esci',

  lotOfMutualFriends: 'Molti amici in comune',

  /* ---------------------------------------------- SCREENS ---------------------------------------------- */
  // AUTH STACK
  fullnameScreen: {
    topSectionTitle: `Iniziamo, qual'è il tuo nome?`,
    inputPlaceholder: 'Il tuo nome',
  },

  dateOfBirthScreen: {
    topSectionTitle: `Ciao {{fullname}}, quando è il tuo compleanno?`,

    dayPlaceholder: 'DD',
    monthPlaceholder: 'MM',
    yearPlaceholder: 'YYYY',
  },

  phoneNumberScreen: {
    topSectionTitle: `Crea il tuo account utilizzando il tuo numero di telefono`,
    hint: "Toccando \"Continua\", accetti le nostre Privacy Policy e Termini di Servizio.",

    inputPlaceholder: 'Il tuo numero',
  },

  countryListScreen: {
    screenTitle: 'Seleziona paese',
  },

  otpScreen: {
    topSectionTitle: `Verifica il tuo numero`,
    topSectionSubtitle: `Codice di verifica inviato a {{phoneNumber}}`,

    resend: 'Reinvia',
    resendIn: 'Reinvia in {{seconds}}s',
  },

  usernameScreen: {
    topSectionTitle: `Bene, crea il tuo username`,
    hint: "Il tuo username è unico. Puoi sempre cambiarlo in seguito.",
    inputPlaceholder: 'Il tuo username',

  },

  // MAIN STACK
  homeScreen: {
    searchPlaceholder: 'Cerca nuovi amici...',
    showAllResults: 'Mostra tutti i risultati',
  },

  // PROFILE STACK
  profileScreen: {
    screenTitle: 'Profilo',
    friendsCount: {
      zero: 'Amici',
      one: 'Amico',
      other: 'Amici',
    },
    snapsCount: {
      zero: 'Snaps',
      one: 'Snap',
      other: 'Snaps',
    },
  },

  friendsListScreen: {
    screenTitle: 'Amici',
    emptyList: 'Sembra che tu non abbia ancora amici.',
    count: {
      zero: 'Nessun amico',
      one: '{{count}} amico',
      other: '{{count}} amici',
    }
  },

  // USER SETTINGS STACK
  userSettingsScreen: {
    screenTitle: 'Impostazioni',

    settings: {
      title: 'Impostazioni',

      items: {
        notificationTitle: 'Notifiche',
        otherTitle: 'Altro'
      }
    },

    privacy: {
      title: 'Privacy',

      items: {
        findMeFromPhoneNumber: 'Trovami tramite il numero di telefono',
        syncContactsTitle: 'Sincronizza contatti',
        blockedUsersTitle: 'Utenti bloccati',
      }
    },

    more: {
      title: 'Di più',

      items: {
        aboutTitle: 'Informazioni su',
        rateThisAppTitle: 'Valuta questa app',
        logoutTitle: 'Esci',
      }
    }
  },

  blockedUsersScreen: {
    screenTitle: 'Utenti bloccati',
    noBlockedUsers: 'Non hai bloccato nessun utente.',
  },

  takeProfilePictureScreen: {
    requestPermission: 'Concedi i permessi per accedere alla fotocamera.',
  },

  editProfileScreen: {
    screenTitle: 'Modifica profilo',

    bottomSheetModal: {
      takePhoto: 'Scatta foto',
      chooseFromLibrary: 'Scegli dalla libreria',
      removeProfilePicture: 'Rimuovi foto profilo',
    }
  },

  otherScreen: {
    screenTitle: 'Altro',

    clearCache: 'Svuota cache',
    deleteAccount: 'Elimina account',
  },

  // Profile
  userProfileScreen: {
    socialContext: {
      mutualFriends: {
        zero: 'Nessun amico in comune',
        one: '{{count}} amico in comune',
        other: '{{count}} amici in comune',
      },
    },
    friendship: {
      accept: 'Accetta',
      deny: 'Rifiuta',
      add: 'Aggiungi',
      cancel: 'Cancella richiesta',
      received: '{{username}} vuole essere tuo amico',
    },
    bottomSheetModal: {
      share: 'Condividi',
      block: 'Blocca {{username}}',
      unfriend: 'Rimuovi dagli amici',
      report: 'Segnala {{username}}',
    }
  },

  mutualFriendsScreen: {
    screenTitle: {
      zero: 'Nessun amico in comune',
      one: '{{count}} amico in comune',
      other: '{{count}} amici in comune',
    }
  },

  // DISCOVERY STACK
  discoveryScreen: {
    screenTitle: "Scopri",
    searchPlaceholder: "Cerca nuovi amici...",
  },

  incomingFriendRequestsScreen: {
    screenTitle: {
      zero: 'Nessuna richiesta di amicizia',
      one: '{{count}} richiesta di amicizia',
      other: '{{count}} richieste di amicizia',
    }
  },

  // Auth
  // auth: {
  //   privacyPolicyHint: "Toccando \"Continua\", accetti le nostre Privacy Policy e Termini di Servizio.",
  //   usernameHint: "Il tuo username è unico. Puoi sempre cambiarlo in seguito.",
  //   fullname: {
  //     title: "Iniziamo, qual'è il tuo nome?",
  //     placeholder: "Il tuo nome",
  //   },
  //   dateOfBirth: {
  //     title: "Ciao {{fullname}}, quando è il tuo compleanno?"
  //   },
  //   phoneNumber: {
  //     title: "Crea il tuo account utilizzando il tuo numero di telefono",
  //     placeholder: 'Il tuo numero',
  //   },
  //   countryList: {
  //     title: "Seleziona paese",
  //   },
  //   otp: {
  //     title: "Verifica il tuo numero",
  //     subtitle: "Codice di verifica inviato a {{phoneNumber}}"
  //   },
  //   username: {
  //     title: "Bene, crea il tuo username",
  //     placeholder: "Il tuo username",
  //   }
  // },

  // friendsRoute: {
  //   friends: {
  //     zero: 'Nessun amico',
  //     one: '{{count}} amico',
  //     other: '{{count}} amici',
  //   }
  // },

  // requestsRoute: {
  //   requestSentTitle: "Richieste inviate",
  //   requestSentDescription: "Controlla le richieste di amicizia che hai inviato.",
  // },

  /* ---------------------------------------------- ALERT ---------------------------------------------- */
  blockUserAlert: {
    title: "Sei sicuro?",
    description: "Se blocchi {{username}}, non potrai più vedere i suoi post e lui non potrà più vedere i tuoi. Vuoi continuare?",
  },

  unfriendUserAlert: {
    title: "Sei sicuro?",
    description: "Se rimuovi {{username}} dagli amici, non potrai più vedere i suoi post e lui non potrà più vedere i tuoi. Vuoi continuare?",
  },

  unblockUserAlert: {
    title: "Sei sicuro?",
    description: "Se sblocchi {{username}}, potrai vedere i suoi post e lui potrà vedere i tuoi. Vuoi continuare?",

  },

  clearCacheAlert: {
    title: "Svuota cache",
    description: "Sei sicuro di voler svuotare la cache?",
    successTitle: "Cache svuotata",
    successDescription: "La cache è stata svuotata con successo.",
  },

  rejectAlert: {
    title: "Sei sicuro?",
    description: "Sei sicuro di voler rifutare la richiesta di amicizia?",
  },

  /* ---------------------------------------------- OTHERS ---------------------------------------------- */
  errors: {
    generic: "Si è verificato un errore, riprova più tardi.",
    noInternetConnection: "Nessuna connessione a Internet.",
    minAge: "Ops! Devi avere almeno {{minAge}} anni per usare questa app.",
    otpInvalid: "Il codice di verifica non è valido.",
    userBanned: "Ops! Sembra che il tuo account sia stato bannato.",
    usernameAlreadyExists: "Ops! Questo username è già stato preso.",
    phoneNumberAlreadyExists: "Ops! Questo numero di telefono è associato ad un altro account.",
    userNotFound: "Ops! Questo utente non esiste.",
    fieldNotValid: "Ops! Inserisci un valore valido.",
    invalidData: "Ops! I dati inseriti non sono validi.",
    auth: {
      sessionIdNotFound: "Ops! Qualcosa è andato storto. Riprova più tardi.",
    },

    fullname: {
      required: "Il nome è richiesto.",
      minLength: "Il nome deve essere di almeno {{minLength}} caratteri.",
      maxLength: "Il nome deve essere di massimo {{maxLength}} caratteri.",
      regex: "Il nome non è valido.",

      invalid: "Il nome non è valido.",
    },

    dateOfBirth: {
      monthRequired: "Il mese è richiesto.",
      dayRequired: "Il giorno è richiesto.",
      yearRequired: "L'anno è richiesto.",

      monthInvalid: "Il mese non è valido.",
      dayInvalid: "Il giorno non è valido.",
      yearInvalid: "L'anno non è valido.",


      invalid: "La data di nascita non è valida.",
      ageNotValid: "Devi avere almeno {{minAge}} anni per usare questa app.",
    },

    otp: {
      invalid: "Il codice di verifica non è valido.",
    },

    username: {
      required: "Lo username è richiesto.",
      minLength: "Lo username deve essere di almeno {{minLength}} caratteri.",
      maxLength: "Lo username deve essere di massimo {{maxLength}} caratteri.",
      regex: "Lo username non è valido.",
      invalid: "Lo username non è valido.",
    },

    authTokenModal: {
      title: "Ops! Qualcosa è andato storto.",
      description: "Non è stato possibile accedere al tuo account. Riprova più tardi.",
      userBanned: "Sembra che il tuo account sia stato bannato. Se pensi che si tratti di un errore, contattaci a {{email}}.",
    },

    // Validation
    invalid: "{{field}} non è valido.",
    required: "{{field}} è richiesto.",
    // minLenght: "{{field}} deve essere di almeno {{minLenght}} caratteri.",
    // maxLenght: "{{field}} deve essere di massimo {{maxLenght}} caratteri.",
    regex: "{{field}} non è valido.",
    min: "{{field}} deve essere maggiore o uguale a {{min}}.",
    max: "{{field}} deve essere minore o uguale a {{max}}.",
  },

  fields: {
    fullname: "Nome",
    dateOfBirth: "Data di nascita",
    dayOfBirth: "Giorno",
    monthOfBirth: "Mese",
    yearOfBirth: "Anno",
    phoneNumber: "Numero di telefono",
    username: "Username",
    biography: "Biografia",
  },

  countries: Countries,
  zodiacSigns: {
    aquarius: "Acquario",
    pisces: "Pesci",
    aries: "Ariete",
    taurus: "Toro",
    gemini: "Gemelli",
    cancer: "Cancro",
    leo: "Leone",
    virgo: "Vergine",
    libra: "Bilancia",
    scorpio: "Scorpione",
    sagittarius: "Sagittario",
    capricorn: "Capricorno",
  },
}

export default itTranslactions;
