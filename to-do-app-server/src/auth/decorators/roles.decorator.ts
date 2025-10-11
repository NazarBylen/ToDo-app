import { SetMetadata } from '@nestjs/common';
import { $Enums } from '@prisma/client';

export const Roles = (...roles: $Enums.Role[]) => SetMetadata('roles', roles);
