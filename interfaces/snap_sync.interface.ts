export interface ISnapSync {
  id: number;

  owner: ISnapSyncUser;
  member: ISnapSyncUser;

  reactionsCount: number;

  postedAtUtc: number; // Unix timestamp in seconds
}

export interface ISnapSyncReactor {
  id: number;
  avatarUrl: string;
  username: string;
}

export interface ISnapSyncUser {
  id: number;
  avatarUrl: string;
  avatarBlurHash?: string;
  username: string;
  isVerified: boolean;

  imageUrl: string;
  imageBlurhash?: string;

  location?: ISnapSyncUserLocation;
}

export interface ISnapSyncUserLocation {
  name: string;
}
