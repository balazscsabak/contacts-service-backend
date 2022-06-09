import { Type } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ObjectId } from 'mongoose';

export class DetailsDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  details: string;
}

export class CreateMessageDetailsDto {
  @IsNotEmpty()
  @IsMongoId()
  message: ObjectId;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  recommendedWebsites?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetailsDto)
  pages?: DetailsDto[];

  @IsOptional()
  @IsNumber()
  recommendedPrice?: number;
}
