import { IsEmail, IsIn } from 'class-validator';
import { $Enums } from '@prisma/client';

export class AddParticipantDto {
  @IsEmail()
  email: string;

  @IsIn([$Enums.Role.ADMIN, $Enums.Role.ADMIN])
  role: $Enums.Role;
}
