import Countries from './countries';

const itTranslactions = {
  continue: 'Continua',

  resend: 'Reinvia',
  resendIn: 'Reinvia in {{seconds}}s',

  search: 'Cerca',
  cancel: 'Annulla',
  block: 'Blocca',
  delete: 'Elimina',

  friends: 'Amici',
  requests: 'Richieste',
  suggestions: 'Suggerimenti',

  // Profile
  profile: {
    friendship: {
      accept: 'Accetta',
      deny: 'Rifiuta',
      add: 'Aggiungi',
      cancel: 'Cancella richiesta',
      received: '{{username}} vuole essere tuo amico',
    },
    bottomSheetModal: {
      // Per il mio profilo
      editProfile: 'Modifica profilo',
      settings: 'Impostazioni',
      logout: 'Esci',

      // Per il profilo di un altro utente
      share: 'Condividi',
      block: 'Blocca {{username}}',
      unfriend: 'Rimuovi dagli amici',
      report: 'Segnala {{username}}',
    }
  },

  // Auth
  auth: {
    privacyPolicyHint: "Toccando \"Continua\", accetti le nostre Privacy Policy e Termini di Servizio.",
    usernameHint: "Il tuo username è unico. Puoi sempre cambiarlo in seguito.",
    fullname: {
      title: "Iniziamo, qual'è il tuo nome?",
      placeholder: "Il tuo nome",
    },
    dateOfBirth: {
      title: "Ciao {{fullname}}, quando è il tuo compleanno?"
    },
    phoneNumber: {
      title: "Crea il tuo account utilizzando il tuo numero di telefono",
      placeholder: 'Il tuo numero',
    },
    countryList: {
      title: "Seleziona paese",
    },
    otp: {
      title: "Verifica il tuo numero",
      subtitle: "Codice di verifica inviato a {{phoneNumber}}"
    },
    username: {
      title: "Bene, crea il tuo username",
      placeholder: "Il tuo username",
    }
  },

  // Search
  search: {
    placeholder: "Cerca amici...",

    noResults: {
      friendsTitle: "Nessun amico trovato.",
      friendsButton: "Cerca nella rubrica",
    }
  },

  // outgoingFriendRequests
  outgoingFriendRequests: {
    screenTitle: "Richieste inviate",
  },

  // incomingFriendRequests
  incomingFriendRequests: {
    listHeaderTitle: "Richieste inviate",
    listHeaderBody: "Controlla le richieste di amicizia che hai inviato.",
  },

  errors: {
    generic: "Si è verificato un errore, riprova più tardi.",
    noInternetConnection: "Nessuna connessione a Internet.",
    minAge: "Ops! Devi avere almeno {{minAge}} anni per usare questa app.",
    otpInvalid: "Il codice di verifica non è valido.",
    userBanned: "Ops! Sembra che il tuo account sia stato bannato.",
    usernameAlreadyExists: "Ops! Questo username è già stato preso.",
    userNotFound: "Ops! Questo utente non esiste.",

    authTokenModal: {
      title: "Ops! Qualcosa è andato storto.",
      description: "Non è stato possibile accedere al tuo account. Riprova più tardi.",
      userBanned: "Sembra che il tuo account sia stato bannato. Se pensi che si tratti di un errore, contattaci a {{email}}.",
    },

    // Validation
    invalid: "{{field}} non è valido.",
    required: "{{field}} è richiesto.",
    minLenght: "{{field}} deve essere di almeno {{minLenght}} caratteri.",
    maxLenght: "{{field}} deve essere di massimo {{maxLenght}} caratteri.",
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
  },

  countries: Countries
}

export default itTranslactions;
