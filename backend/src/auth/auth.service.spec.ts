import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findOneByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      const user = {
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        _doc: { _id: 'testId' },
      };
      mockUsersService.findOneByEmail.mockResolvedValue(user);
      const result = await authService.validateUser(
        'test@example.com',
        'password123',
      );
      expect(result).toEqual({
        email: 'test@example.com',
        _doc: { _id: 'testId' },
      });
    });

    it('should return null if credentials are invalid', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue(null);
      const result = await authService.validateUser(
        'test@example.com',
        'password123',
      );
      expect(result).toBeNull();
    });
  });

  describe('register', () => {
    it('should create a new user', async () => {
      const registerUserDto: RegisterUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const createdUser = {
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
      };
      mockUsersService.create.mockResolvedValue(createdUser);
      const result = await authService.register(registerUserDto);
      expect(result).toEqual(createdUser);
    });
  });

  describe('login', () => {
    it('should return a JWT token', async () => {
      const user = { _doc: { _id: '123', email: 'test@example.com' } };
      const token = 'testToken';
      mockJwtService.sign.mockReturnValue(token);
      const result = await authService.login(user);
      expect(result).toEqual({ access_token: token });
    });

    it('should throw UnauthorizedException if user is undefined', async () => {
      await expect(authService.login(null)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
