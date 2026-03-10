export type UserProfile = {
  email: string;
  id: string;
  name: string;
};

export type SaveUserProfileInput = Omit<UserProfile, "id">;
