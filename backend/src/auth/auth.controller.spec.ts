import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jw-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { RegisterUserDto } from './dto/register-user.dto';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let usersService: UsersService;
  let configService: ConfigService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  const mockUsersService = {
    updatePassword: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  let mockResponse: Partial<Response>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(AuthGuard('google'))
      .useValue({ canActivate: () => true })
      .compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    configService = module.get<ConfigService>(ConfigService);

    mockResponse = {
      redirect: jest.fn(),
    };
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should register a user', async () => {
      const registerUserDto: RegisterUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      await authController.register(registerUserDto);
      expect(authService.register).toHaveBeenCalledWith(registerUserDto);
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const req = { user: { userId: '123' } };
      await authController.login(req);
      expect(authService.login).toHaveBeenCalledWith(req.user);
    });
  });

  describe('getProfile', () => {
    it('should get user profile', () => {
      const req = { user: { userId: '123', email: 'test@example.com' } };
      const profile = authController.getProfile(req);
      expect(profile).toEqual(req.user);
    });
  });

  describe('googleAuthRedirect', () => {
    it('should redirect with token', async () => {
      const req = { user: { userId: '123' } };
      const token = { access_token: 'testToken' };
      const frontendUrl = 'http://example.com';
      const redirectUrl = `${frontendUrl}/google-redirect?token=${encodeURIComponent(token.access_token)}`;

      mockAuthService.login.mockResolvedValue(token);
      mockConfigService.get.mockReturnValue(frontendUrl);

      await authController.googleAuthRedirect(req, mockResponse as Response);

      expect(authService.login).toHaveBeenCalledWith(req.user);
      expect(configService.get).toHaveBeenCalledWith('FRONTEND_URL');
      expect(mockResponse.redirect).toHaveBeenCalledWith(redirectUrl);
    });
  });
});
