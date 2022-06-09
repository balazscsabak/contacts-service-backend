import {
  MessageDetails,
  MessageDetailsSchema,
} from './schemas/message-details.schema';
import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schemas/message.schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { MessageItem, MessageItemSchema } from './schemas/message-item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: MessageDetails.name, schema: MessageDetailsSchema },
      { name: MessageItem.name, schema: MessageItemSchema },
    ]),
    CloudinaryModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
