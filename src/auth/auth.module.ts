import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { GoogleStrategy } from './strategy/google.strategy';
import { RefreshTokenStrategy } from './strategy/refreshToken.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy, RefreshTokenStrategy],
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      global: true,
    }),
    UsersModule,
  ],
})
export class AuthModule {}
