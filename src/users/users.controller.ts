import {
  Body,
  Controller,
  Get,
  UseGuards,
  Request,
  Inject,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/users.entity';
import { JWTAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from '../role/role.guard';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/role/role.enum';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  @Roles(Role.Admin)
  @UseGuards(JWTAuthGuard)
  @Get('')
  async findAll() {
    const value = await this.cacheManager.get('key');
    if (!value) {
      const users = await this.usersService.findAll();
      const data = JSON.stringify(users);
      await this.cacheManager.set('key', data);
      return users.map((user) => user);
    }
    console.log(value);
    return value;
  }

  @Get('profile')
  @UseGuards(JWTAuthGuard)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  getProfile(@Request() req: any) {
    return req.user;
  }
}
