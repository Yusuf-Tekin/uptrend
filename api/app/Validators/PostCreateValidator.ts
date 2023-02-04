import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TeamRoles from 'App/Helper/Enums/TeamRoles'

export default class PostCreateValidator {
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

    postText:schema.string({trim:true},[
      rules.required(),
      rules.minLength(1),
      rules.maxLength(255),
    ]),
    role:schema.enum(Object.values(TeamRoles),[
      rules.required()
    ]),
    isComments: schema.boolean.optional(),
    teamId:schema.number([
      rules.required()
    ])
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
    'postText.required':"Paylaşılacak gönderi metni zorunludur.",
    'postText.minLength':'Gönderi metni en az {{options.minLength}} karakter içermeli!',
    'postText.maxLength':'Gönderi metni en fazla {{options.maxLength}} karakter olabilir!',
    'role.enum':'Paylaşılacak gönderinin pozisyonu geçersizdir.',
    'role.required':'Paylaşılacak gönderinin pozisyonu zorunludur.',
    'teamId.required':"Paylaşılan gönderinin takım id'si zorunludur."
  }
}
