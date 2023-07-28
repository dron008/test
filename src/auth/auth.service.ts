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

      return {
        accessToken: this.jwtService.sign({ userId: user.id }),
      };
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
      },
    });
    return register;
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
  async goLogin(req: { user: any }) {
    console.log(req);
  }
  async googleLogin(req: { user: any }) {
    if (!req.user) {
      return 'No user from google';
    }
    console.log(req.user);
    return {
      message: 'User from google account',
      user: req.user,
    };
  }
}
