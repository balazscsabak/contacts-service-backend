import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateMessageItemDto {
  @IsNotEmpty()
  @IsMongoId()
  message: ObjectId;

  @IsNotEmpty()
  @IsString()
  @IsEnum(['text', 'image'])
  type!: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(['client', 'server'])
  from!: string;

  images?: Array<Express.Multer.File>;

  @IsOptional()
  @IsString()
  text?: string;
}
