import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { $Enums } from '@prisma/client';
import { AddParticipantDto } from './dto/add-participant.dto';

@Controller('lists')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Post()
  create(@Body() createListDto: CreateListDto, @Req() req: Request) {
    const userId = req.user['id'];
    return this.listsService.create(createListDto, userId);
  }

  @Get()
  findAll(@Req() req: Request) {
    const userId = req.user['id'];
    return this.listsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const userId = req.user['id'];
    return this.listsService.findOne(id, userId);
  }

  @Post(':id/participants')
  @UseGuards(AuthGuard('jwt'), RolesGuard) // Застосовуємо guards
  @Roles($Enums.Role.ADMIN) // Тільки ADMIN може додавати учасників
  async addParticipant(
    @Param('id', ParseIntPipe) id: number,
    @Body() addParticipantDto: AddParticipantDto,
    @Req() req: Request,
  ) {
    const userId = req.user['id'];
    const list = await this.listsService.findOne(id, userId);
    if (list.ownerId !== userId) {
      throw new UnauthorizedException('Only the owner can add participants.');
    }
    return this.listsService.addParticipant(id, addParticipantDto);
  }

  @Put(':id')
  @Roles($Enums.Role.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateListDto: UpdateListDto,
    @Req() req: Request,
  ) {
    const userId = req.user['id'];
    const list = await this.listsService.findOne(id, userId);
    if (list.ownerId !== userId) {
      throw new UnauthorizedException('Only the owner can update the list.');
    }
    return this.listsService.update(id, updateListDto);
  }

  @Delete(':id')
  @Roles($Enums.Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const userId = req.user['id'];
    const list = await this.listsService.findOne(id, userId);
    if (list.ownerId !== userId) {
      throw new UnauthorizedException('Only the owner can delete the list.');
    }
    return this.listsService.remove(id);
  }
}
