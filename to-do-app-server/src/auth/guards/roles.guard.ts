import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user['id'];
    const listId = parseInt(request.params.listId, 10);

    const participant = await this.prisma.participant.findUnique({
      where: {
        userId_listId: {
          userId,
          listId,
        },
      },
    });

    if (!participant) {
      throw new UnauthorizedException(
        'You are not a participant of this list.',
      );
    }

    return roles.includes(participant.role);
  }
}
