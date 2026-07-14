import { Request, Response } from 'express';
import { UserCreate } from '@/interfaces/UserCreate';
import { UserDelete } from '@/interfaces/UserDelete';
import { UserLogin } from '@/interfaces/UserLogin';
import { UserUpdate } from '@/interfaces/UserUpdate';
import { createUserRepository } from '@/repositories/createUserRepository';

const userRepository = createUserRepository();

export const createUserController = () => {
  const create = async (req: Request<unknown, unknown, UserCreate>, res: Response) => {
    try {
      return res.status(201).json(await userRepository.create(req.body));
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  const read = async (req: Request, res: Response) => {
    try {
      return res.status(200).json(await userRepository.read(req.params.id));
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  const update = async (req: Request, res: Response) => {
    try {
      return res.status(200).json(await userRepository.update(req.params.id, req.body));
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  const logicalDelete = async (req: Request, res: Response) => {
    try {
      return res.status(200).json(await userRepository.delete({ id: req.params.id }));
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  const list = async (req: Request<unknown, unknown, unknown, { page?: string; pageSize?: string }>, res: Response) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 0;
      const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;
      return res.status(200).json(await userRepository.list(page, pageSize));
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  const login = async (req: Request<unknown, unknown, UserLogin>, res: Response) => {
    try {
      return res.status(200).json(await userRepository.login(req.body));
    } catch (error: any) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  };

  return { create, read, update, delete: logicalDelete, list, login };
};
