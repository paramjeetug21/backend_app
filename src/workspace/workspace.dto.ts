import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';

import { IsOptional } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsEmpty()
  color: string;
}

export class UpdateWorkspaceDto {
  @IsOptional()
  @IsString()
  name?: string;
}
