import { UserRead } from '@/interfaces/UserRead';

export interface UserLoginResponse {
  token: string;
  user: UserRead;
}
