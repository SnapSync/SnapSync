export interface IWebInfo {
  isPrivate: boolean;
  allowSyncContacts: boolean;

  isNotSynced?: boolean; // is a local used property only, it tells us if the current state of the exercise is synced with the backend.
}
