import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User';

export default class PostComments extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public comment:string;

  @belongsTo(() => User,{
    localKey:'id',
    serializeAs:'author'
  })
  public user: BelongsTo<typeof User>


  @column({})
  public userId:number;

  @column()
  public postId:number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
