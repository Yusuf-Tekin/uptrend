import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ErrorResponse from "App/Helper/Response/ErrorResponse";
import SuccessResponse from "App/Helper/Response/SuccessResponse";
import User from "App/Models/User";

export default class UsersController {
  async profile(ctx: HttpContextContract) {
    const {response,auth} = ctx;
    const findUser = await User.query().where({
      id:auth.user?.id
    })
    .preload('teams',(teams) => {
      teams.preload('users')
      teams.preload('posts',(posts) => {
        posts.preload('comments',(comments) => {
          comments.preload('user');
          comments.orderBy('created_at','desc')
        });
        posts.preload('likes');
        posts.orderBy('created_at','desc')
      })

      teams.preload('messages',(messages) => {
        messages.orderBy('created_at','desc')
        messages.preload('team')
        messages.preload('user')

      })
    }) 
    .preload('notifications')
    

    if(!findUser) {
      return response.notFound(new ErrorResponse('Kullanıcı bulunamadı.Oturum sonlandırılıyor.',404));
    }

    findUser.map(user => user.serialize());
    return response.ok(new SuccessResponse("Başarılı",200,{
      ...findUser[0].toJSON()
    }))
  }
}
