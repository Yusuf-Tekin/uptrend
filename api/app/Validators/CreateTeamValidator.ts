import { schema,rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateTeamValidator {
  constructor(protected ctx: HttpContextContract) {}

 
  public schema = schema.create({
    name:schema.string({trim:true},[
      rules.required(),
      rules.maxLength(20),
      rules.unique({
        column:'name',
        table:'teams'
      }),
    ]),
    image:schema.file.optional({
      extnames:['jpg','jpeg','png'],
      size:'2mb'
    },),
    about: schema.string.optional({},[
      rules.maxLength(355),
    ])
  })

  public messages: CustomMessages = {
    'about.maxLength':'Takım içeriği hakkında en fazla {{options.maxLength}} karakter kelime kullanılabilir.',
    'file.size':"Takım profil resmi en fazla {{options.size}} mb olmalıdır.",
    'file.extname':"Takım profil resmi {{options.extnames}} uzantılarından birine sahip olmalıdır.",
    'name.required':'Takım adı zorunludur',
    'name.maxLength':"Takım adı maksimum {{options.maxLength}} karakter olmalıdır.",
    'name.unique':"Takım adı daha önce alınmış.",
    'file.file':"Dosya doğrulanamadı!"
  }
}
