import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({
  timestamps: true,
})
export class Message {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  user!: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'MessageDetails',
    required: false,
  })
  details?: Types.ObjectId;

  @Prop()
  description!: string;

  @Prop()
  title!: string;

  @Prop({ default: true })
  isNewMsg: boolean;

  @Prop()
  notifyClient: boolean;

  @Prop()
  notifyServer: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
