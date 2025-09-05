import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service.js';

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userService.createUser(req.body);
    return res.status(201).json(user);
  } catch (err) {
    return next(err);
  }
}

export async function index(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await userService.getUsers();
    return res.json(users);
  } catch (err) {
    return next(err);
  }
}

export async function show(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const user = await userService.getUserById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(user);
  } catch (err) {
    return next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const user = await userService.updateUser(id, req.body);
    return res.json(user);
  } catch (err) {
    return next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const result = await userService.deleteUser(id);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}
