import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { SchemaTypes, Types, Document } from 'mongoose';

export type MessageDetailsDocument = MessageDetails & Document;

@Schema({
  timestamps: true,
})
export class MessageDetails {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  user!: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Message', required: true })
  message!: Types.ObjectId;

  @Prop({ type: [String] })
  recommendedWebsites?: string[];

  @Prop({ type: [Object] })
  recommendedImages?: (UploadApiResponse | UploadApiErrorResponse)[];

  @Prop({
    type: [{ name: { type: String }, details: { type: String } }],
    _id: false,
  })
  pages?: [
    {
      name: string;
      details: string;
    },
  ];

  @Prop()
  recommendedPrice?: number;
}

export const MessageDetailsSchema =
  SchemaFactory.createForClass(MessageDetails);
