import { IsNotEmpty, IsOptional, IsUUID, IsString } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  content?: object;

  @IsOptional()
  @IsUUID()
  parentId?: string;
}

export class UpdateDocumentDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  content?: object;

  @IsOptional()
  isArchived?: boolean;
}
