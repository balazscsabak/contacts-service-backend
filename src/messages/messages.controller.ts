import { CreateMessageDetailsDto } from './dto/create-message-details.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseInterceptors,
  UploadedFiles,
  NotFoundException,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { AddImageToDetailsDto } from './dto/add-image-to-details.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateMessageItemDto } from './dto/create-message-item.dto';
import { isMongoId, isNotEmpty } from 'class-validator';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(@Request() req, @Body() createMessageDto: CreateMessageDto) {
    const userId = req.user._id;
    return this.messagesService.create(userId, createMessageDto);
  }

  @Post('item/image/:id')
  @UseInterceptors(FilesInterceptor('images'))
  createItemImage(
    @Request() req,
    @Param('id') messageId,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    const userId = req.user._id;
    const userEmail = req.user.email;
    console.log(req.user.isAdmin);

    return this.messagesService.createItemImage(
      userId,
      userEmail,
      messageId,
      images,
      req.user.isAdmin,
    );
  }

  @Post('item/text')
  @UseInterceptors(FilesInterceptor('images'))
  createItemText(
    @Request() req,
    @Body() createMessageItem: CreateMessageItemDto,
  ) {
    const userId = req.user._id;
    return this.messagesService.createItemText(userId, createMessageItem);
  }

  @Get()
  async findAll() {
    return this.messagesService.findAll();
  }

  @Get('/items/:id')
  async findAllItems(@Request() req, @Param('id') id: string) {
    return this.messagesService.findAllItems(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(id);
  }

  @Get('/details/:id')
  findOneDetail(@Request() req, @Param('id') id: string) {
    const userId = req.user._id;

    return this.messagesService.findOneDetail(id, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(+id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(+id);
  }

  @Post('/details')
  createDetails(
    @Request() req,
    @Body() createMessageDetailsDto: CreateMessageDetailsDto,
  ) {
    const userId = req.user._id;

    return this.messagesService.createDetails(userId, createMessageDetailsDto);
  }

  @Post('/details/images')
  @UseInterceptors(FilesInterceptor('recommendedImages'))
  addImagesToDetails(
    @Request() req,
    @Body() addImageToDetailsDto: AddImageToDetailsDto,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    const userEmail = req.user.email;

    const { messageDetails } = addImageToDetailsDto;

    return this.messagesService.addImagesToDetails(
      messageDetails,
      userEmail,
      images,
    );
  }

  @Post('/mark-as-read')
  markAsRead(@Request() req, @Body('message') message: string) {
    if (!isNotEmpty(message) || !isMongoId(message)) {
      throw new NotFoundException();
    }

    return this.messagesService.markAsRead(message);
  }
}
