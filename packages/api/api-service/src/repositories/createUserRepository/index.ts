import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '@/config';
import { User } from '@/interfaces/User';
import { UserCreate } from '@/interfaces/UserCreate';
import { UserDelete } from '@/interfaces/UserDelete';
import { UserList } from '@/interfaces/UserList';
import { UserLogin } from '@/interfaces/UserLogin';
import { UserLoginResponse } from '@/interfaces/UserLoginResponse';
import { UserRead } from '@/interfaces/UserRead';
import { UserUpdate } from '@/interfaces/UserUpdate';
import { createUserModel } from '@/models/createUserModel';

const userModel = createUserModel();

const sanitizeUser = (user: User): UserRead => {
  const { password, ...userRead } = user;
  return userRead;
};

export const createUserRepository = () => {
  const create = async (payload: UserCreate): Promise<UserRead> => {
    try {
      const password = await bcrypt.hash(payload.password, 10);
      return sanitizeUser(await userModel.create({ ...payload, password }));
    } catch (error) {
      throw new Error(`[Repo Error] Failed to create user: ${error}`);
    }
  };

  const read = async (id: string): Promise<UserRead> => {
    const user = await userModel.read(id);
    if (!user) throw new Error(`User with ID ${id} not found`);
    return sanitizeUser(user);
  };

  const update = async (id: string, payload: UserUpdate): Promise<UserRead> => {
    const updates = payload.password ? { ...payload, password: await bcrypt.hash(payload.password, 10) } : payload;
    const user = await userModel.update(id, updates);
    if (!user) throw new Error(`User with ID ${id} not found to update`);
    return sanitizeUser(user);
  };

  const logicalDelete = async (payload: UserDelete): Promise<UserRead> => {
    const user = await userModel.delete(payload.id);
    if (!user) throw new Error(`User with ID ${payload.id} not found to delete`);
    return sanitizeUser(user);
  };

  const list = async (page = 0, pageSize = 10): Promise<UserList> => {
    const result = await userModel.list(page, pageSize);
    return { ...result, data: result.data.map(sanitizeUser) };
  };

  const login = async (credentials: UserLogin): Promise<UserLoginResponse> => {
    const user = await userModel.findByEmail(credentials.email);
    if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
      throw new Error('Invalid credentials');
    }
    if (!config.jwtSecretKey) throw new Error('JWT secret is not configured');

    const userRead = sanitizeUser(user);
    return {
      token: jwt.sign({ id: userRead.id, email: userRead.email }, config.jwtSecretKey, { expiresIn: config.jwtExpiresIn }),
      user: userRead,
    };
  };

  return { create, read, update, delete: logicalDelete, list, login };
};
