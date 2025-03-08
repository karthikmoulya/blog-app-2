import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && user.password) {
      if (await bcrypt.compare(pass, user.password)) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async register(registerUserDto: RegisterUserDto): Promise<any> {
    const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);
    const user = await this.usersService.create({
      email: registerUserDto.email,
      password: hashedPassword,
    });
    return user;
  }

  async login(user: any): Promise<{ access_token: string }> {
    if (!user || !user._doc || !user._doc._id) {
      console.log(
        'Error: User or user._doc or user._doc._id is undefined in login method',
      );
      throw new UnauthorizedException('User is undefined');
    }
    const payload = {
      sub: user._doc._id.toString(), // Access _id from _doc
      email: user._doc.email,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
