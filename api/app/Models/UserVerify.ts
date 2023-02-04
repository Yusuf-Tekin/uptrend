import Env from '@ioc:Adonis/Core/Env';
import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Mail from '@ioc:Adonis/Addons/Mail';
import User from './User';

export default class UserVerify extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId:number;

  @column()
  public token: string;

  @column.dateTime()
  public expired_time:DateTime;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public static async sendVerifyEmail(user:User,token:string) {
    await Mail.send((message) => {
      message
        .from(Env.get('SMTP_USERNAME'))
        .to(user.email)
        .subject('Hesabınızı Doğrulayın | UpTrend')
        .htmlView('emails/verify', {
          fullname:user.fullname,
          link:`http://uptrend.com/verify/${token}`
        });
    })
    

  }
}
