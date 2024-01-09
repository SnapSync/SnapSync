const _controller = '/friendships';

export const myFriendsCount = `${_controller}/friends/count`;
export const myFriends = `${_controller}/friends`;
export const show = (id: number) => `${_controller}/show/${id}`;
export const mutualFriends = (id: number) => `${_controller}/mutual_friends/${id}`;

export const createFriendRequest = (id: number) => `${_controller}/create/${id}`;
export const destroyFriendRequest = (id: number) => `${_controller}/destroy/${id}`;
export const acceptFriendRequest = (id: number) => `${_controller}/accept/${id}`;
export const rejectFriendRequest = (id: number) => `${_controller}/reject/${id}`;
