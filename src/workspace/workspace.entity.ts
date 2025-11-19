import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Document } from 'src/documents/documents.eneity';
import { User } from 'src/user/user.entity';
import { WorkspaceUser } from 'src/workspace_user/workspaceUser.entity';

@Table({
  tableName: 'workspaces',
  timestamps: true,
  paranoid: false,
})
export class Workspace extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare color: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare createdBy: string;

  @Column({ field: 'created_at' })
  declare createdAt: Date;

  @Column({ field: 'updated_at' })
  declare updatedAt: Date;

  @BelongsTo(() => User, 'createdBy')
  declare owner: User;

  @HasMany(() => WorkspaceUser)
  declare workspaceUsers: WorkspaceUser[];

  @HasMany(() => Document)
  declare documents: Document[];
}
