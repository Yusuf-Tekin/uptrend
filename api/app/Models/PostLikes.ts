import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class PostLikes extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({
    serializeAs:'user_id'
  })
  public authorId:number;

  @column()
  public postId:number;
  

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
