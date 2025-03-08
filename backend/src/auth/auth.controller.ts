import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Get,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jw-auth.guard';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Request() req) {}

  //   @Get('google/callback')
  //   @UseGuards(AuthGuard('google'))
  //   async googleAuthRedirect(@Request() req, @Res() res: Response) {
  //     const token = await this.authService.login(req.user);
  //     res.redirect(
  //       `<span class="math-inline">\{process\.env\.FRONTEND\_URL\}/google\-redirect?token\=</span>{token.access_token}`,
  //     );
  //   }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Request() req, @Res() res: Response) {
    const token = await this.authService.login(req.user);
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const redirectUrl = `${frontendUrl}/google-redirect?token=${encodeURIComponent(token.access_token)}`;
    res.redirect(redirectUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Post('set-password')
  async setPassword(@Request() req, @Body('password') password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.usersService.updatePassword(req.user.userId, hashedPassword);
    return { message: 'Password set successfully' };
  }
}
