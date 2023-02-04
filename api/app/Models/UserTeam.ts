import { DateTime } from 'luxon'
import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import TeamRoles from 'App/Helper/Enums/TeamRoles';
import User from './User';

export default class UserTeam extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId:number;

  @column()
  public teamId:number;

  @column()
  public role:TeamRoles;

  @column()
  public isConfirmed:boolean;
  
  @column.dateTime({autoCreate:true})
  public joined_at:DateTime;
  

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
