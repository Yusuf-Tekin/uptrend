import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import NotificationTypes from 'App/Helper/Enums/NotificationTypes';

export default class Notification extends BaseModel {
  @column({ isPrimary: true })
  public id: number


  @column()
  public title:string;

  @column()
  public content:string;

  @column()
  public isRead:boolean;

  @column()
  public userId:number;

  @column()
  public type:NotificationTypes

  @column()
  public redirectUrl:string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
