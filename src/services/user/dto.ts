export interface UserProfile {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  [key: string]: unknown;
}

export interface UserProfileResponse {
  user: UserProfile;
}
