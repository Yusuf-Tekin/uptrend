import { schema,rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    fullname:schema.string({trim:true}, [
      rules.required(),
      rules.maxLength(50),
    ]),
    username: schema.string({trim:true},[
      rules.required(),
      rules.unique({
        column:'username',
        table:'users'
      }),
      rules.maxLength(30),
    ]),
    email:schema.string({trim:true},[
      rules.required(),
      rules.email(),
      rules.unique({
        table:'users',
        column:'email'
      }),
    ]),
    password: schema.string({trim:true}, [
      rules.required(),
      rules.minLength(6),
    ])
  })

  
  public messages: CustomMessages = {
    'fullname.required':"Ad-Soyad zorunludur.",
    'fullname.maxLength':'Ad-Soyad maksimum {{options.maxLength}} karakter olabilir.',

    'username.required':"Kullanıcı adı zorunludur.",
    'username.maxLength': 'Kullanıcı adı maksimum {{options.maxLength}} karakter olabilir.',
    'username.unique':'Kullanıcı adı kullanılamaz.',

    'email.email':'Lütfen geçerli bir e-posta adresi belirtin.',
    'email.required':'E-Posta adresi zorunludur.',
    'email.unique':'E-Posta adresi kullanılamaz.',

    'password.required':'Şifre zorunludur.',
    'password.minLength':'Şifre en az {{options.minLength}} karakter olmalıdır.',

  }
}
