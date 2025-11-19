import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/user/user.entity';

@Table({
  tableName: 'notifications',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
})
export class Notification extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  /** The user who receives this notification **/
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'user_id',
  })
  declare userId: string;

  @BelongsTo(() => User, { foreignKey: 'userId' })
  declare user: User;

  /** Notification message **/
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare message: string;

  /** Read/unread status **/
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    field: 'is_read',
  })
  declare isRead: boolean;

  /** Timestamp **/
  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  declare createdAt: Date;
}
