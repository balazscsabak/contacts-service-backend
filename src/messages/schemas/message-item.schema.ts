import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { SchemaTypes, Types, Document } from 'mongoose';

export type MessageItemDocument = MessageItem & Document;

@Schema({
  timestamps: true,
})
export class MessageItem {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Message', required: true })
  message!: Types.ObjectId;

  @Prop({ type: SchemaTypes.String, required: true })
  type!: 'text' | 'image';

  @Prop({ type: SchemaTypes.String, required: true })
  from!: 'client' | 'server';

  @Prop({ type: SchemaTypes.String, default: '' })
  text?: string;

  @Prop({ type: [Object] })
  images?: (UploadApiResponse | UploadApiErrorResponse)[];
}

export const MessageItemSchema = SchemaFactory.createForClass(MessageItem);
