// import { authUtil } from '@/api/auth/utils';
// import { StoreUser } from '@/api/store/store-user.model';
// import { User } from '@/api/user/models';
// import { cache } from '@/app/app-cache';
// import { BadRequestError } from '@/core';
// import loginInstance, { Login } from '.';

// jest.mock('@/api/auth/utils');
// jest.mock('@/app/app-cache');
// jest.mock('@/api/user/models');
// jest.mock('@/api/store/store-user.model');

// describe('Login', () => {
//     let login: any;

//     beforeEach(() => {
//         login = loginInstance;
//         jest.clearAllMocks();
//     });

//     it('should log in a user with valid credentials', async () => {
//         const mockUser = {
//             id: 'user-id',
//             emailAddress: 'user@example.com',
//             password: 'hashedpassword',
//             isSoftDeleted: jest.fn().mockReturnValue(false),
//             toJSON: jest.fn().mockReturnValue({ id: 'user-id', emailAddress: 'user@example.com' }),
//         };
//         User.findOne = jest.fn().mockResolvedValue(mockUser);
//         authUtil._generateToken = jest.fn().mockReturnValue('access-token');
//         cache.set = jest.fn().mockResolvedValue(true);

//         const payload = {
//             input: { emailAddress: 'user@example.com', password: 'password123' },
//             request: {
//                 login: jest.fn((_, __, callback) => callback(null)),
//             },
//         };

//         const result = await login.handle(payload, 'user');

//         expect(result).toEqual({
//             code: 200,
//             message: 'Logged in Successfully',
//             data: {
//                 user: { id: 'user-id', emailAddress: 'user@example.com', password: undefined },
//                 tokens: { accessToken: 'access-token', refreshToken: 'access-token' },
//             },
//         });
//         expect(authUtil._generateToken).toHaveBeenCalled();
//         expect(cache.set).toHaveBeenCalledWith('user-id_REFRESH_TOKEN', 'access-token');
//     });

//     it('should throw an error for invalid user credentials', async () => {
//         User.findOne = jest.fn().mockResolvedValue(null);

//         const payload = {
//             input: { emailAddress: 'invalid@example.com', password: 'password123' },
//             request: {},
//         };

//         await expect(login.handle(payload, 'user')).rejects.toThrow(BadRequestError);
//     });

//     it('should throw an error for soft-deleted users', async () => {
//         const mockUser = {
//             isSoftDeleted: jest.fn().mockReturnValue(true),
//         };
//         User.findOne = jest.fn().mockResolvedValue(mockUser);

//         const payload = {
//             input: { emailAddress: 'user@example.com', password: 'password123' },
//             request: {},
//         };

//         await expect(login.handle(payload, 'user')).rejects.toThrow(BadRequestError);
//     });

//     it('should log in a store user with valid credentials', async () => {
//         const mockStoreUser = {
//             id: 'store-user-id',
//             emailAddress: 'storeuser@example.com',
//             password: 'hashedpassword',
//             isSoftDeleted: jest.fn().mockReturnValue(false),
//             toJSON: jest.fn().mockReturnValue({ id: 'store-user-id', emailAddress: 'storeuser@example.com' }),
//         };
//         StoreUser.findOne = jest.fn().mockResolvedValue(mockStoreUser);
//         authUtil._generateToken = jest.fn().mockReturnValue('access-token');
//         cache.set = jest.fn().mockResolvedValue(true);

//         const payload = {
//             input: { emailAddress: 'storeuser@example.com', password: 'password123' },
//             request: {
//                 login: jest.fn((_, __, callback) => callback(null)),
//             },
//         };

//         const result = await login.handle(payload, 'store_user');

//         expect(result).toEqual({
//             code: 200,
//             message: 'Logged in Successfully',
//             data: {
//                 user: { id: 'store-user-id', emailAddress: 'storeuser@example.com', password: undefined },
//                 tokens: { accessToken: 'access-token', refreshToken: 'access-token' },
//             },
//         });
//         expect(authUtil._generateToken).toHaveBeenCalled();
//         expect(cache.set).toHaveBeenCalledWith('store-user-id_REFRESH_TOKEN', 'access-token');
//     });

//     it('should throw an error if input is missing', async () => {
//         const payload = {
//             input: null,
//             request: {},
//         };

//         await expect(login.handle(payload, 'user')).rejects.toThrow(BadRequestError);
//     });
// });
