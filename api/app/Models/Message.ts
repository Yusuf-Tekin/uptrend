import { DateTime } from 'luxon'
import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import User from './User';
import Team from './Team';

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public message:string;

  @hasOne(() => User,{
    serializeAs:'author',
    foreignKey:'id',
    localKey:'author_id'
  })
  public user:HasOne<typeof User>

  @column({
    columnName:'author_id'
  })
  public author_id:number;

  @hasOne(() => Team,{
    foreignKey:'id'
  })
  public team:HasOne<typeof Team>

  @column()
  public team_id:number;


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true,serializeAs:null })
  public updatedAt: DateTime
}
