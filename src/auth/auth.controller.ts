import { LocalAuthGuard } from './local-auth.guard';
import {
  Controller,
  Post,
  UseGuards,
  Request,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private cloudinary: CloudinaryService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login/credentials')
  async loginCredentials(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('me')
  me(@Request() req) {
    return req.user;
  }

  @Post('test')
  @UseInterceptors(FilesInterceptor('files'))
  async test(
    @Request() req,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<(UploadApiResponse | UploadApiErrorResponse)[]> {
    const images = await Promise.all(
      files.map((file) => this.cloudinary.uploadImage(file, req.user.email)),
    );

    return images;
    return req.user;
  }
}
