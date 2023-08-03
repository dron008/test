import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';
import { AuthDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';
import { JWTAuthGuard } from './jwt-auth.guard';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserEntity } from 'src/users/entities/users.entity';
import { GoogleOathAuthGuard } from './google.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @ApiResponse({ type: AuthEntity })
  login(@Body() dto: LoginDto) {
    console.log(dto);
    return this.authService.login(dto);
  }

  @Post('register')
  @ApiResponse({ type: AuthEntity })
  register(@Body() dto: AuthDto) {
    console.log(dto);
    return this.authService.register(dto);
  }

  @Patch(':id')
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAuthDto: UpdateAuthDto,
  ) {
    return await this.authService.update(id, updateAuthDto);
  }

  @Delete(':id')
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.authService.remove(id);
  }

  @Get('')
  @UseGuards(GoogleOathAuthGuard)
  @ApiBearerAuth()
  async googleAuth(@Request() req: any) {}

  @Get('google-redirect')
  @UseGuards(GoogleOathAuthGuard)
  @ApiBearerAuth()
  googleAuthRedirect(@Request() req: any) {
    return this.authService.googleLogin(req);
  }
}
