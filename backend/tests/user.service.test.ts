// import { describe, it, expect, vi, beforeEach } from 'vitest';
// import prisma from '../src/prismaClient';
// import * as userService from '../src/services/user.service';

// vi.mock('../src/prismaClient', () => ({
//   default: {
//     user: {
//       create: vi.fn()
//     }
//   }
// }));

// describe('user.service', () => {
//   beforeEach(() => {
//     vi.clearAllMocks();
//   });

//   it('should create a user (calls prisma.user.create)', async () => {
//     const mockCreated = { id: 1, name: 'Arthur', email: 'a@example.com', password: 'hashed', createdAt: new Date(), updatedAt: new Date() };
//     # @ts-ignore
//     prisma.user.create.mockResolvedValue(mockCreated);

//     const result = await userService.createUser({ name: 'Arthur', email: 'a@example.com', password: 'secret' });

//     expect(prisma.user.create).toHaveBeenCalled();
//     expect(result).toMatchObject({ id: 1, name: 'Arthur', email: 'a@example.com' });
//   });
// });
