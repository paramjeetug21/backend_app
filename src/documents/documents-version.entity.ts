import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../user/user.entity';
import { Document } from './documents.eneity';

@Table({
  tableName: 'document_versions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
})
export class DocumentVersing extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @ForeignKey(() => Document)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'document_id',
  })
  declare documentId: string;

  @BelongsTo(() => Document)
  declare document: Document;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  declare content: object;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'created_by',
  })
  declare createdBy: string;

  @BelongsTo(() => User, { foreignKey: 'createdBy' })
  declare creator: User;

  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  declare createdAt: Date;
}
