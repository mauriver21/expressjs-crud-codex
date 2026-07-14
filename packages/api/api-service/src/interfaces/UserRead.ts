export interface UserRead {
  id: string;
  name: string;
  email: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
