import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsArray,
  IsString,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { DetailsDto } from './create-message-details.dto';
import { CreateMessageDto } from './create-message.dto';

export class UpdateMessageDetailsDto extends PartialType(CreateMessageDto) {
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
