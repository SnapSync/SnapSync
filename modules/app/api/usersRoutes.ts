const _controller = "/users";

export const me = `${_controller}/me`;
export const userProfile = (id: number) => `${_controller}/profiles/${id}`;
