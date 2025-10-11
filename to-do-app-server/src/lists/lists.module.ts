import { Module } from '@nestjs/common';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { ListsAccessGuard } from './guards/lists-access.guard';

@Module({
  imports: [AuthModule],
  controllers: [ListsController],
  providers: [ListsService, PrismaService, ListsAccessGuard],
  exports: [ListsService],
})
export class ListsModule {}
