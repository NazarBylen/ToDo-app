import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(listId: number, createTaskDto: CreateTaskDto) {
    // Створення нового завдання в конкретному списку
    return this.prisma.task.create({
      data: {
        listId: listId,
        title: createTaskDto.title,
        description: createTaskDto.description,
      },
    });
  }

  async findOne(taskId: number) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found.`);
    }
    return task;
  }

  async update(taskId: number, updateTaskDto: UpdateTaskDto) {
    // Редагування існуючого завдання
    return this.prisma.task.update({
      where: { id: taskId },
      data: updateTaskDto,
    });
  }

  async remove(taskId: number) {
    // Видалення завдання
    return this.prisma.task.delete({
      where: { id: taskId },
    });
  }
}
