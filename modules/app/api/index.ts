import Network from '@/utils/network';
import * as AuthRoutes from './authRoutes';
import * as FriendshipsRoutes from './friendshipsRoutes';
import * as UsersRoutes from './usersRoutes';
import { IAccountInfoDTO } from '../types/IAccountInfoDTO';
import { ICountDTO } from '../types/ICountDTO';
import { IUserDTO } from '../types/IUserDTO';
import { IResponseInfiniteDTO } from '../types/IResponseInfiniteDTO';
import { IFriendshipStatusDTO } from '../types/IFriendshipStatusDTO';
import { IUserProfileDTO } from '../types/IUserProfileDTO';

// AUTH
export function login(LoginDTO: any) {
  return Network.post<IAccountInfoDTO>({
    url: AuthRoutes.logIn,
    data: LoginDTO,
    // successMessaging: false,
  });
}

export function loginAuthToken(LoginDTO: any) {
  return Network.post<IAccountInfoDTO>({
    url: AuthRoutes.logInAuthToken,
    data: LoginDTO,
    // successMessaging: false,
  });
}

// FRIENDSHIPS
export function myFriendsCount() {
  return Network.get<ICountDTO>({
    url: FriendshipsRoutes.myFriendsCount,
    // successMessaging: false,
  });
}

export function myFriends(page?: number, size?: number) {
  let qs = '?page=' + (page || 1) + '&size=' + (size || 30);

  return Network.get<IResponseInfiniteDTO<IUserDTO>>({
    url: FriendshipsRoutes.myFriends,
    queryString: qs,
    // successMessaging: false,
  });
}

export function showFriendship(id: number) {
  return Network.get<IFriendshipStatusDTO>({
    url: FriendshipsRoutes.show(id),
    // successMessaging: false,
  });
}

export function mutualFriends(id: number, page?: number, size?: number) {
  let qs = '?page=' + (page || 1) + '&size=' + (size || 30);

  return Network.get<IResponseInfiniteDTO<IUserDTO>>({
    url: FriendshipsRoutes.mutualFriends(id),
    queryString: qs,
    // successMessaging: false,
  });
}

export function sendFriendRequest(id: number) {
  return Network.post<IFriendshipStatusDTO>({
    url: FriendshipsRoutes.createFriendRequest(id),
    // successMessaging: false,
  });
}

export function destroyFriendRequest(id: number) {
  return Network.post<IFriendshipStatusDTO>({
    url: FriendshipsRoutes.destroyFriendRequest(id),
    // successMessaging: false,
  });
}

export function acceptFriendRequest(id: number) {
  return Network.post<IFriendshipStatusDTO>({
    url: FriendshipsRoutes.acceptFriendRequest(id),
    // successMessaging: false,
  });
}

export function rejectFriendRequest(id: number) {
  return Network.post<IFriendshipStatusDTO>({
    url: FriendshipsRoutes.rejectFriendRequest(id),
    // successMessaging: false,
  });
}

// USERS
export function getMe() {
  return Network.get<IUserDTO>({
    url: UsersRoutes.me,
    // successMessaging: false,
  });
}

export function getUserProfile(id: number) {
  return Network.get<IUserProfileDTO>({
    url: UsersRoutes.userProfile(id),
    // successMessaging: false,
  });
}
