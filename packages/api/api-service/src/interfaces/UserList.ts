import { Pagination } from '@/interfaces/Pagination';
import { UserRead } from '@/interfaces/UserRead';

export interface UserList {
  data: UserRead[];
  pagination: Pagination;
}
