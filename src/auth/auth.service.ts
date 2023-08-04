import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthEntity } from './entity/auth.entity';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(dto: LoginDto): Promise<AuthEntity> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      // if no user is found throw an error
      if (!user) {
        throw new NotFoundException(`No user found for email : ${dto.email}`);
      }

      // check if the password is correct
      // const isPasswordValid = user.password === password;
      const isMatch = await bcrypt.compare(dto.password, user.password);

      if (!isMatch) {
        throw new NotFoundException('Invalid Password');
      }

      const tokens = await this.getTokens(user.id, user.email);
      await this.updateRefreshToken(user.id, tokens.refreshToken);
      return tokens;
    } catch (error) {
      return error.message;
    }
  }

  async register(dto: AuthDto) {
    const hash = await bcrypt.hash(dto.password, 10);
    const register = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        name: dto.name,
        role: ['user'],
      },
    });
    const tokens = await this.getTokens(register.id, register.email);
    await this.updateRefreshToken(register.id, tokens.refreshToken);
    return tokens;
  }

  async update(id: number, updateAuthDto: UpdateAuthDto) {
    if (updateAuthDto.password) {
      updateAuthDto.password = await bcrypt.hash(updateAuthDto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateAuthDto,
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
  async googleLogin(req: { user: any }) {
    if (!req.user) {
      return 'No user from google';
    }
    return {
      message: 'User from google account',
      user: req.user,
    };
  }
  async getTokens(userId: number, email: string): Promise<AuthEntity> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.sign(
        {
          userId,
          email,
        },
        {
          secret: `${process.env.JWT_SECRET}`,
          expiresIn: `${process.env.EXPIRES_DATE}`,
        },
      ),
      this.jwtService.sign(
        {
          userId,
          email,
        },
        {
          secret: `${process.env.JWT_SECRET}`,
          expiresIn: `${process.env.EXPIRES_DATE}`,
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken: refreshToken,
    };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: refreshToken,
      },
    });
  }
}
