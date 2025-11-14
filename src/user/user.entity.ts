import { Table, Column, Model, DataType, Default } from 'sequelize-typescript';

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
}
