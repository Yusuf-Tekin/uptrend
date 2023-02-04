import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User';
import Post from './Post';
import Message from './Message';

export default class Team extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name:string;

  @column()
  public image:string;

  @column()
  public about:string;

  @column()
  public author_id:number;

  @column()
  public is_active:boolean;

  @manyToMany(() => User, {
    pivotForeignKey:'team_id',
    pivotRelatedForeignKey:'user_id',
    serializeAs:'users',
    pivotTable:'user_teams',
    onQuery:((query) => {
      query.where({
        is_confirmed:true
      })
    })

  })
  public users:ManyToMany<typeof User>

  @hasMany(() => Message,{
    foreignKey:'team_id',
  })
  public messages:HasMany<typeof Message>


  @hasMany(() => Post)
  public posts: HasMany<typeof Post>;


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
