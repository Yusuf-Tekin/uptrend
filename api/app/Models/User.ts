import Hash from '@ioc:Adonis/Core/Hash';
import { DateTime } from 'luxon'
import {  BaseModel, beforeSave, column, HasMany, hasMany, HasOne, hasOne, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import UserVerify from './UserVerify';
import UserTeam from './UserTeam';
import Team from './Team';
import Notification from './Notification';
import Post from './Post';
import PostComments from './PostComments';

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public username:string;

  @column()
  public fullname:string;

  @hasOne(() => UserVerify)
  public userVerifyId:HasOne<typeof UserVerify>;

  @column()
  public email:string;

  @column({serializeAs:null})
  public password:string;

  @column()
  public profileImage:string;

  @hasMany(() => UserTeam)
  public teamId:HasMany<typeof UserTeam>;

  @hasMany(() => PostComments)
  public comments:HasMany<typeof PostComments>

  @column()
  public isBlock:boolean;

  @column()
  public isVerify:boolean;
  
  @manyToMany(() => Team,{
    pivotForeignKey:'user_id',
    pivotRelatedForeignKey:'team_id',
    serializeAs:'teams',
    pivotTable:'user_teams'
  })
  public teams:ManyToMany<typeof Team>

  @hasMany(() => Notification)
  public notifications:HasMany<typeof Notification>

  @column({serializeAs:null})
  public resetPasswordToken:string;

  @column.dateTime({serializeAs:null})
  public resetPasswordExpired:DateTime;


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async passwordHashBeforeCreate(user: User) {
    if(user.$dirty.password) {
      user.password = await Hash.make(user.password.trim());
    }
  }
}
