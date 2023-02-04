import TeamRoles from 'App/Helper/Enums/TeamRoles';
import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class JoinTeamValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    user_id:schema.number([
      rules.required(),
    ]),
    team_id:schema.number([
      rules.required(),
    ]),
    role:schema.enum(Object.values(TeamRoles), [
      rules.required(),
    ]),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    'user_id.required':"Kullanıcı id bilgisi zorunludur.",
    'user_id.regex':"Lütfen geçerli bir id bilgisi gönderin.",
    'team_id.required':"Takım id bilgisi zorunludur.",
    'team_id.regex':'Lütfen geçerli bir id bilgisi gönderin.',
    'role.required':"Takımda hangi rol için başvurduğunuzu lütfen belirtin.",
    'role.enum':"Pozisyon bilgisi geçersiz.Lütfen geçerli bir pozisyon için başvurun."
  }
}
