import { IsUUID, IsString, IsOptional } from 'class-validator';

export class AddUserToWorkspaceDto {
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  role?: string; // Editor / Viewer / Admin
}

export class UpdateUserRoleDto {
  @IsString()
  role: string;
}
export class AddUserByEmailDto {
  email: string;
  role?: string; // default role is Viewer
}

export class UpdateNotificationDto {
  isRead: boolean;
}
