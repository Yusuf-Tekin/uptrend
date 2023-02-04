import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import TeamRoles from 'App/Helper/Enums/TeamRoles';
import PostLikes from './PostLikes';
import PostComments from './PostComments';
import Team from './Team';

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public authorId:number;

  @column()
  public teamId:number;

  @column()
  public postText:string;

  @column()
  public role:TeamRoles;

  @column()
  public isComments:boolean;


  @hasMany(() => PostLikes)
  public likes:HasMany<typeof PostLikes>;

  @hasMany(() => PostComments,{
    foreignKey:'postId'
  })
  public comments:HasMany<typeof PostComments>

  @hasOne(() => Team,{
    foreignKey:'id',
    localKey:'teamId'
  })
  public team:HasOne<typeof Team>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true,serializeAs:null })
  public updatedAt: DateTime
}
