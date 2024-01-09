import { ILocalization } from './it';

const resource: ILocalization = {
  confirm: 'Confirm',
  cancel: 'Cancel',
  generalActivityIndicatorText: 'Loading...',
  pleaseWait: 'Please wait... ',
  generalErrorText: 'An error occurred, please try again later.',
  search: 'Search',
  noInternet: 'No Internet Connection',
  yes: 'Yes',
  no: 'No',
  exit: 'Exit',
  brand: 'Brand',
  published: 'Published',
  min: 'min',
  piece: 'Piece',
  time: 'Time',
  description: 'Description',
  send: 'Send',
  next: 'Next',
  previous: 'Previous',

  friends: 'Friends',
  mutualFriends: 'Mutual Friends',
  friendWith: 'Friend with',
  friendRequestFrom: '{{username}} wants to be your friend',
  accept: 'Accept',
  decline: 'Decline',
  addFriend: 'Add Friend',
  cancelRequest: 'Cancel Request',
  snaps: 'Snaps',
  streak: 'Streak',

  share: 'Share',
  removeFromFriends: 'Remove from friends',
  block: 'Block',
  report: 'Report',

  errors: {
    userNotFound: 'User not found',
  },

  navigation: {
    home: 'Home Page',
    profile: 'Profile',
    settings: 'Settings',
    post: 'Post',
    friends: 'Friends',
    mutualFriends: {
      zero: 'No mutual friends',
      one: '1 mutual friend',
      other: '{{count}} mutual friends',
    },
    fallbackMutualFriends: 'Mutual Friends',
  },

  alerts: {
    unfriend: {
      title: 'Are you sure you want to remove {{username}} from your friends?',
      message: "You won't be able to see his snaps anymore and he won't be able to see yours.",
    },
  },
};

export default resource;
