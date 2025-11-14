import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/user/user.service';
import { config } from 'dotenv';
config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    super({
      clientID: '566457015052-o084ui720k7bnv4pq8e1915q4lc6o7uq.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'https://backend-app-ashen.vercel.app/api/auth/google/callback',
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ) {
    let user = await this.userService.findByEmail(profile.emails[0].value);

    if (!user) {
      user = await this.userService.create({
        auth_provider: 'google',
        email: profile.emails[0].value,
        name: profile.displayName,
      });
    }
    const payload = { id: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    done(null, { ...user.toJSON(), token });
  }
}
