const resource = {
  confirm: 'Conferma',
  cancel: 'Annulla',
  generalActivityIndicatorText: 'Caricamento... ',
  pleaseWait: 'Attendere prego...',
  generalErrorText: 'Un errore si è verificato, riprova più tardi.',
  search: 'Cerca',
  noInternet: 'Nessuna connessione a Internet',
  yes: 'Sì',
  no: 'No',
  exit: 'Esci',
  brand: 'Brand',
  published: 'Pubblicato',
  min: 'Min',
  piece: 'Pezzo',
  time: 'Tempo',
  description: 'Descrizione',
  send: 'Invia',
  next: 'Avanti',
  previous: 'Precedente',

  friends: 'Amici',
  mutualFriends: 'Amici in comune',
  friendWith: 'Amico di',
  friendRequestFrom: '{{username}} vuole essere tuo amico',
  accept: 'Accetta',
  decline: 'Rifiuta',
  addFriend: 'Aggiungi amico',
  cancelRequest: 'Annulla richiesta',
  snaps: 'Snaps',
  streak: 'Streak',

  share: 'Condividi',
  removeFromFriends: 'Rimuovi dagli amici',
  block: 'Blocca',
  report: 'Segnala',

  errors: {
    userNotFound: 'Utente non trovato',
  },

  navigation: {
    home: 'Home',
    profile: 'Profilo',
    settings: 'Impostazioni',
    post: 'Post',
    friends: 'Amici',
    mutualFriends: {
      zero: 'Nessun amico in comune',
      one: '1 amico in comune',
      other: '{{count}} amici in comune',
    },
    fallbackMutualFriends: 'Amici in comune',
  },

  alerts: {
    unfriend: {
      title: 'Sei sicuro di voler rimuovere {{username}} dai tuoi amici?',
      message: 'Non potrai più vedere i suoi snap e lui non potrà più vedere i tuoi.',
    },
  },
};

export default resource;

export type ILocalization = typeof resource;
