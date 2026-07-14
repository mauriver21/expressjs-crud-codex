import { object, string } from 'yup';

export const createUserSchema = object({
  name: string().trim().required(),
  email: string().trim().email().required(),
  password: string().min(8).required(),
});

export const updateUserSchema = object({
  name: string().trim().optional(),
  email: string().trim().email().optional(),
  password: string().min(8).optional(),
});

export const loginUserSchema = object({
  email: string().trim().email().required(),
  password: string().required(),
});
