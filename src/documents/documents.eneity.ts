import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../user/user.entity';
import { Workspace } from '../workspace/workspace.entity';

@Table({
  tableName: 'documents',
  timestamps: true,
  paranoid: false,
})
export class Document extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  // WORKSPACE -----------------------------------------
  @ForeignKey(() => Workspace)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'workspace_id',
  })
  declare workspaceId: string;

  @BelongsTo(() => Workspace)
  declare workspace: Workspace;

  // TITLE ----------------------------------------------
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare title: string;

  // CONTENT -------------------------------------------
  @Column({
    type: DataType.JSONB,
    defaultValue: {},
  })
  declare content: object;

  // PARENT DOCUMENT -----------------------------------
  @ForeignKey(() => Document)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'parent_id', // FIXED
  })
  declare parentId: string;

  @BelongsTo(() => Document, {
    foreignKey: 'parentId',
  })
  declare parent: Document;

  // ARCHIVED -------------------------------------------
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    field: 'is_archived',
  })
  declare isArchived: boolean;

  // CREATED BY -----------------------------------------
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'created_by',
  })
  declare createdBy: string;

  @BelongsTo(() => User, { foreignKey: 'createdBy' })
  declare creator: User;

  // UPDATED BY -----------------------------------------
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'updated_by',
  })
  declare updatedBy: string | null; // ✅ allow null

  @BelongsTo(() => User, { foreignKey: 'updatedBy' })
  declare updater: User;

  // CREATED_AT (snake_case in DB)
  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  declare createdAt: Date;

  // UPDATED_AT (snake_case in DB)
  @Column({
    type: DataType.DATE,
    field: 'updated_at',
  })
  declare updatedAt: Date;
}
