import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let usersService: UsersService;
  let userModel: Model<User>;

  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    exec: jest.fn(),
    save: jest.fn(),
    constructor: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(getModelToken(User.name));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('findOneByEmail', () => {
    // ... (other tests)
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData = { email: 'test@example.com', password: 'password123' };
      const createdUser = { ...userData, _id: 'someId' }; // Mock the created user

      mockUserModel.create.mockResolvedValue(createdUser);

      const result = await usersService.create(userData);

      expect(result).toEqual(createdUser); // Compare with createdUser
      expect(mockUserModel.create).toHaveBeenCalledWith(userData);
    });
  });

  describe('findOneById', () => {
    // ... (other tests)
  });

  describe('updatePassword', () => {
    // ... (other tests)
  });
});
