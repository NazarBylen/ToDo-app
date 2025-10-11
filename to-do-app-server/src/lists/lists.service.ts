import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { AddParticipantDto } from './dto/add-participant.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ListsService {
  constructor(private prisma: PrismaService) {}

  async addParticipant(listId: number, addParticipantDto: AddParticipantDto) {
    const userToAdd = await this.prisma.user.findUnique({
      where: { email: addParticipantDto.email },
    });
    if (!userToAdd) {
      throw new NotFoundException('User with this email not found.');
    }

    try {
      return await this.prisma.participant.create({
        data: {
          userId: userToAdd.id,
          listId: listId,
          role: addParticipantDto.role,
        },
        include: {
          user: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'User is already a participant in this list.',
        );
      }
      throw error;
    }
  }

  async create(createListDto: CreateListDto, userId: number) {
    // Створення нового списку та додавання користувача як ADMIN
    return this.prisma.todoList.create({
      data: {
        title: createListDto.title,
        ownerId: userId,
        participants: {
          create: {
            userId: userId,
            role: 'ADMIN',
          },
        },
      },
      include: {
        tasks: true,
      },
    });
  }

  async findAll(userId: number) {
    // Пошук усіх списків, до яких користувач має доступ (власник або учасник)
    return this.prisma.todoList.findMany({
      where: {
        OR: [
          { ownerId: userId },
          {
            participants: {
              some: {
                userId: userId,
              },
            },
          },
        ],
      },
      include: {
        owner: true,
        tasks: true,
      },
    });
  }

  async findOne(listId: number, userId: number) {
    const list = await this.prisma.todoList.findFirst({
      where: {
        id: listId,
        OR: [
          { ownerId: userId },
          {
            participants: {
              some: {
                userId: userId,
              },
            },
          },
        ],
      },
      include: {
        owner: true,
        participants: {
          include: {
            user: true,
          },
        },
        tasks: true,
      },
    });

    if (!list) {
      throw new NotFoundException(
        `List with ID ${listId} not found or you don't have access.`,
      );
    }

    return list;
  }

  async update(listId: number, updateListDto: UpdateListDto) {
    return this.prisma.todoList.update({
      where: { id: listId },
      data: updateListDto,
    });
  }

  async remove(listId: number) {
    return this.prisma.todoList.delete({
      where: { id: listId },
    });
  }

  async hasAccess(listId: number, userId: number): Promise<boolean> {
    const list = await this.prisma.todoList.findFirst({
      where: {
        id: listId, // listId вже є числом
        OR: [
          { ownerId: userId },
          {
            participants: {
              some: {
                userId: userId,
              },
            },
          },
        ],
      },
    });
    return !!list;
  }
}
