// src/collab/document-version.entity.ts
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Document } from 'src/documents/documents.eneity';
import { User } from 'src/user/user.entity';

@Table({
  tableName: 'document_versions',
  timestamps: true,
  paranoid: false,
})
export class DocumentVersion extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @ForeignKey(() => Document)
  @Column({ type: DataType.UUID, allowNull: false })
  declare documentId: string;

  @BelongsTo(() => Document)
  declare document: Document;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  declare createdBy: string;

  @BelongsTo(() => User)
  declare creator: User;

  // full snapshot (or a compact diff) -- JSONB
  @Column({ type: DataType.JSONB, allowNull: false })
  declare snapshot: object;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare message: string; // optional changelog message
}
