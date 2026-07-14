export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
