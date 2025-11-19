import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/user/user.entity';
import { Workspace } from 'src/workspace/workspace.entity';

@Table({
  tableName: 'workspace_user',
  timestamps: true,
  paranoid: false,
})
export class WorkspaceUser extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @ForeignKey(() => Workspace)
  @Column({ field: 'workspace_id', type: DataType.UUID, allowNull: false })
  declare workspaceId: string;

  @BelongsTo(() => Workspace, { onDelete: 'CASCADE' })
  declare workspace: Workspace;

  @ForeignKey(() => User)
  @Column({ field: 'user_id', type: DataType.UUID, allowNull: false })
  declare userId: string;

  @BelongsTo(() => User, { onDelete: 'CASCADE' })
  declare user: User;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    defaultValue: 'Viewer', // Admin / Editor / Viewer
  })
  declare role: string;

  @Column({ field: 'created_at' })
  declare createdAt: Date;

  @Column({ field: 'updated_at' })
  declare updatedAt: Date;
}
