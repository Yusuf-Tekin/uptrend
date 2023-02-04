import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateTeamValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({

    teamName: schema.string({trim:true}, [rules.required()]),
    image:schema.file.optional({
      extnames:['jpg','jpeg','png'],
      size:'2mb'
    },),
    teamAbout: schema.string.optional([rules.maxLength(355)]),
    isActive:schema.boolean([rules.required()]),
    teamId: schema.number([rules.required()])
  })

  public messages: CustomMessages = {
    'teamName.required':'Takım adı zorunludur',
    'teamAbout.maxLength':'Takım hakkında metni en fazla {{options.maxLength}} karakter olabilir.',
    'isActive.required':"Takım aktiflik bilgisi zorunludur",
    'file.size':"Takım profil resmi en fazla {{options.size}} mb olmalıdır.",
    'file.extname':"Takım profil resmi {{options.extnames}} uzantılarından birine sahip olmalıdır.",
    'teamId.required':"Takım id bilgisi zorunludur."
  }
}
