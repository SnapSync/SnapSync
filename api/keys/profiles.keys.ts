const ProfilesKeys = {
  me: ["me"] as const,
  id: (userId: number) => ["profile", userId] as const,
};

export default ProfilesKeys;
