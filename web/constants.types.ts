export type JsonApiResponse = {
  success: boolean;
  data?: [] | {} | string;
  error?: string;
};

export type User = {
  name: string;
  email: string;
  id: string;
  emailVerified: boolean;
};

export type UserProfile = {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  avatarUrl: string;
  username: string;
};

export type UserPreferences = {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  theme: string;
  weightUnit: string;
};

export type Session = {
  user: {
    name: string;
    email: string;
    id: string;
    emailVerified: boolean;
    profile: UserProfile;
    preferences: UserPreferences;
    token: string;
  };
  expires: string;
  iat: number;
  exp: number;
};
