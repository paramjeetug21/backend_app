import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  HasMany,
} from 'sequelize-typescript';
import { Document } from 'src/documents/documents.eneity';
import { Workspace } from 'src/workspace/workspace.entity';
import { WorkspaceUser } from '../workspace_user/workspaceUser.entity';

@Table({
  tableName: 'users',
  timestamps: false,
  paranoid: false,
})
export class User extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare name: string;

  @Column({
    type: DataType.STRING(150),
    unique: true,
    allowNull: false,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare password: string;

  @Default('local')
  @Column({
    type: DataType.STRING(20),
  })
  declare auth_provider: string;

  // Workspaces created/owned by this user
  @HasMany(() => Workspace, 'createdBy')
  declare ownedWorkspaces: Workspace[];

  // Workspace memberships (many-to-many via WorkspaceUser)
  @HasMany(() => WorkspaceUser)
  declare workspaceUsers: WorkspaceUser[];

  // Documents created by this user
  @HasMany(() => Document, 'createdBy')
  declare documents: Document[];
}
