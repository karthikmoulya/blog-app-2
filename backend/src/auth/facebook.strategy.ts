import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private configService: ConfigService) {
    const clientID = configService.get<string>('FACEBOOK_APP_ID');
    const clientSecret = configService.get<string>('FACEBOOK_APP_SECRET');
    const callbackURL = configService.get<string>('FACEBOOK_CALLBACK_URL');

    if (!clientID || !clientSecret || !callbackURL) {
      throw new UnauthorizedException(
        'Facebook configuration is missing or invalid.',
      );
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: 'email',
      profileFields: ['id', 'displayName', 'emails'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const { emails, displayName, id } = profile;
    const user = {
      email: emails?.[0]?.value, // Use optional chaining to prevent errors
      name: displayName,
      facebookId: id,
      accessToken,
    };
    done(null, user);
  }
}
