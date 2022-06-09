import {
  MessageDetails,
  MessageDetailsDocument,
} from './schemas/message-details.schema';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message, MessageDocument } from './schemas/message.schema';
import { Model } from 'mongoose';
import { CreateMessageDetailsDto } from './dto/create-message-details.dto';
import { ObjectId } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CreateMessageItemDto } from './dto/create-message-item.dto';
import { isMongoId } from 'class-validator';
import {
  MessageItem,
  MessageItemDocument,
} from './schemas/message-item.schema';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(MessageDetails.name)
    private messageDetailsModel: Model<MessageDetailsDocument>,
    @InjectModel(MessageItem.name)
    private messageItemModel: Model<MessageItemDocument>,
    private cloudinary: CloudinaryService,
  ) {}

  async create(
    userId: string,
    createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    try {
      const message = await new this.messageModel({
        ...createMessageDto,
        user: userId,
      }).save();

      return message;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async createItemText(
    userId: string,
    createMessageItem: CreateMessageItemDto,
  ) {
    let message;

    try {
      message = await this.messageModel
        .findById(createMessageItem.message)
        .exec();
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!message) throw new NotFoundException();

    if (message.user.toString() !== userId) throw new NotFoundException();

    try {
      const newMessageItem = await new this.messageItemModel(
        createMessageItem,
      ).save();

      return newMessageItem;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async createItemImage(
    userId: string,
    userEmail: string,
    messageId: string,
    images: Array<Express.Multer.File>,
    isAdmin: boolean,
  ) {
    if (!isMongoId(messageId)) throw new NotFoundException();

    let message = await this.messageModel.findById(messageId).exec();

    if (!message) throw new NotFoundException();

    if (message.user.toString() !== userId) throw new NotFoundException();

    try {
      const savedImages = [];
      let saveAttempt;

      if (images) {
        saveAttempt = await Promise.all(
          images.map((image) => {
            return this.cloudinary.uploadImage(image, userEmail);
          }),
        );
      }

      if (saveAttempt) {
        saveAttempt.map((_img) => {
          if (_img.public_id) savedImages.push(_img);
        });
      }

      const newMessageItem = await new this.messageItemModel({
        type: 'image',
        images: savedImages,
        message: messageId,
        from: isAdmin ? 'server' : 'client',
      }).save();

      return newMessageItem;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  findAll() {
    return this.messageModel
      .find()
      .sort({ createdAt: -1 })
      .populate(['user', 'details'])
      .exec();
  }

  findAllItems(messageId: string) {
    if (!isMongoId(messageId)) {
      throw new NotFoundException();
    }

    try {
      return this.messageItemModel
        .find({ message: messageId })
        .sort({ createdAt: 1 })
        .exec();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  findOne(id: string) {
    return this.messageModel.findById(id).populate(['user', 'details']).exec();
  }

  async findOneDetail(messageDetailId: string, userId: string) {
    let messageDetail = null;

    try {
      messageDetail = await this.messageDetailsModel
        .findById(messageDetailId)
        .exec();
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!messageDetail) throw new NotFoundException();

    if (messageDetail.user.toString() !== userId) throw new NotFoundException();

    return messageDetail;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }

  async createDetails(
    userId: string,
    createMessageDetailsDto: CreateMessageDetailsDto,
  ) {
    let message;

    try {
      message = await this.messageModel
        .findById(createMessageDetailsDto.message)
        .exec();
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!message) throw new NotFoundException();

    try {
      const messageDetails = await new this.messageDetailsModel({
        ...createMessageDetailsDto,
        user: userId,
      }).save();

      message.details = messageDetails._id;
      await message.save();

      return messageDetails;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async addImagesToDetails(
    messageDetailsId: ObjectId,
    email: string,
    images: Array<Express.Multer.File>,
  ) {
    try {
      const messageDetails = await this.messageDetailsModel
        .findById(messageDetailsId)
        .exec();

      if (!messageDetails) {
        throw new NotFoundException(
          `Message Details with ID: ${messageDetailsId} does not exist.`,
        );
      }

      const saveAttempt = await Promise.all(
        images.map((image) => this.cloudinary.uploadImage(image, email)),
      );

      const savedImages = [];

      saveAttempt.map((_img) => {
        if (_img.public_id) savedImages.push(_img);
      });

      messageDetails.recommendedImages = [
        ...messageDetails.recommendedImages,
        ...savedImages,
      ];

      return await messageDetails.save();
    } catch (error) {
      throw new NotFoundException(
        `Message Details with ID: ${messageDetailsId} does not exist.`,
      );
    }
  }

  async markAsRead(message: string): Promise<boolean> {
    try {
      const msg = await this.messageModel.findByIdAndUpdate(message, {
        isNewMsg: false,
      });

      console.log(msg);

      if (!msg) throw new NotFoundException();

      return true;
    } catch (error) {
      return false;
    }
  }
}
