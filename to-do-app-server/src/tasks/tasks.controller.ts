import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '@nestjs/passport';
import { ListsAccessGuard } from '../lists/guards/lists-access.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { $Enums } from '@prisma/client';

@Controller('lists/:listId/tasks')
@UseGuards(AuthGuard('jwt'), ListsAccessGuard, RolesGuard) // Додаємо RolesGuard
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Roles($Enums.Role.ADMIN) // Тільки ADMIN може створювати завдання
  create(
    @Param('listId', ParseIntPipe) listId: number,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.create(listId, createTaskDto);
  }

  @Put(':taskId')
  // ADMIN може редагувати та видаляти завдання, VIEWER - лише відмічати
  @Roles($Enums.Role.ADMIN, $Enums.Role.VIEWER)
  update(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(taskId, updateTaskDto);
  }

  @Delete(':taskId')
  @Roles($Enums.Role.ADMIN) // Тільки ADMIN може видаляти завдання
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('taskId', ParseIntPipe) taskId: number) {
    return this.tasksService.remove(taskId);
  }
}
