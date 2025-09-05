import prisma from '../prismaClient.js';

type UserCreate = { name: string; email: string; phone: string; city: string; status: 'active' | 'inactive' };
type UserUpdate = Partial<UserCreate>;

const selectUser = {
  id: true,
  name: true,
  email: true,
  phone: true,
  city: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true,
} as const;

export async function createUser(data: UserCreate) {
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      city: data.city,
      status: data.status,
    },
    select: selectUser as any,
  } as any);
  return user;
}

export async function getUsers() {
  const users = await prisma.user.findMany({
    select: selectUser as any,
    orderBy: { id: 'asc' },
  } as any);
  return users;
}

export async function getUserById(id: number) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: selectUser as any,
  } as any);
  return user;
}

export async function updateUser(id: number, data: UserUpdate) {
  const user = await prisma.user.update({
    where: { id },
    data,
    select: selectUser as any,
  } as any);
  return user;
}

export async function deleteUser(id: number) {
  await prisma.user.delete({ where: { id } } as any);
  return { message: 'User deleted' };
}
