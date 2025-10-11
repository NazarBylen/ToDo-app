import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ListsService } from '../lists.service';

@Injectable()
export class ListsAccessGuard implements CanActivate {
  constructor(private listsService: ListsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user['id'];
    const listId = parseInt(request.params.listId, 10); // Конвертуємо в число

    if (isNaN(listId)) {
      return false;
    }

    const hasAccess = await this.listsService.hasAccess(listId, userId);

    if (!hasAccess) {
      throw new UnauthorizedException(
        'You do not have permission to access this list.',
      );
    }

    return true;
  }
}
