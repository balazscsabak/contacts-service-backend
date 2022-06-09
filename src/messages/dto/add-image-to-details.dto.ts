import { IsOptional, IsNotEmpty, IsMongoId, IsArray } from 'class-validator';
import { ObjectId } from 'mongoose';

export class AddImageToDetailsDto {
  @IsNotEmpty()
  @IsMongoId()
  messageDetails: ObjectId;

  recommendedImages?: Array<Express.Multer.File>;
}
