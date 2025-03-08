import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  VerifyCallback,
  StrategyOptions,
} from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');

    if (!clientID) {
      throw new UnauthorizedException('GOOGLE_CLIENT_ID is not defined');
    }

    if (!clientSecret) {
      throw new UnauthorizedException('GOOGLE_CLIENT_SECRET is not defined');
    }

    const options: StrategyOptions = {
      clientID: clientID,
      clientSecret: clientSecret,
      callbackURL: 'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],
    };

    super(options);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { emails, photos, displayName } = profile;
    const user = await this.usersService.findOneByEmail(emails[0].value);

    if (user) {
      done(null, user);
    } else {
      const newUser = await this.usersService.create({
        email: emails[0].value,
        name: displayName,
        picture: photos[0].value,
        googleId: profile.id,
      });
      done(null, newUser);
    }
  }
}
