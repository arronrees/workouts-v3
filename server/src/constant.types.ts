import { User } from '@prisma/client';

export type JsonApiResponse = {
  success: boolean;
  data?: [] | {} | string;
  error?: string;
};

export type ResLocals = {
  user: User;
  userToken: string;
};
