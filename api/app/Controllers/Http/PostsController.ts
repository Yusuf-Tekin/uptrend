import Database from '@ioc:Adonis/Lucid/Database';
import ErrorResponse from "App/Helper/Response/ErrorResponse";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import NoBodyException from "App/Exceptions/NoBodyException";
import Post from "App/Models/Post";
import Team from "App/Models/Team";
import PostCreateValidator from "App/Validators/PostCreateValidator";
import SuccessResponse from "App/Helper/Response/SuccessResponse";
import PostLikes from "App/Models/PostLikes";
import CreateCommentValidator from "App/Validators/CreateCommentValidator";
import PostComments from "App/Models/PostComments";
import User from "App/Models/User";

export default class PostsController {
  async createPost(ctx: HttpContextContract) {
    const { request, response, auth } = ctx;

    if (!request.hasBody()) {
      throw new NoBodyException();
    }

    await request.validate(new PostCreateValidator(ctx));

    const { postText, role, isComments, teamId } = request.body();

    const text = String(postText).split(" ");
    let ws = 0;
    text.map((t,index) => {
        if(t === "<br/>" && text[index-1] === "<br/>") {
            ws++;
        }
        if(ws > 1) {
            if(t === "<br/>") {
                text.splice(index,1);
            }
        }
    })

    let newText= "";

    text.map(t => newText+=t.concat(" "));

    const findTeam = await Team.findBy("id", teamId);

    if (!findTeam || findTeam.author_id != auth.user?.id) {
      return response.notFound(new ErrorResponse("Bir problem oluştu!", 400));
    }

    const createPost = await Post.create({
      postText:newText,
      role,
      isComments:isComments,
      teamId,
      authorId: auth.user?.id,
    });

    await createPost.load("comments");
    await createPost.load("likes");

    createPost.serialize();

    return response.ok(
      new SuccessResponse("Gönderi paylaşıldı", 200, {
        createPost,
      })
    );
  }

  async getTeamPosts({ request, response, auth }: HttpContextContract) {
    const { teamId } = request.qs();

    if (!teamId) {
      return response.badRequest(
        new ErrorResponse("Lütfen geçerli bir takım id'si gönderin", 400)
      );
    }

    const findTeam = await Team.query()
      .where({
        id: teamId,
      })
      .preload("posts", (posts) => {
        posts.preload("comments", (comments) => {
          comments.preload("user");
          comments.orderBy("created_at", "desc")
        });
        posts.preload("likes");
        posts.orderBy('created_at','desc')
      })
      .preload("users")
      .first();

    if (!findTeam) {
      return response.badRequest(new ErrorResponse("Takım bulunamadı", 404));
    }

    const isMember = findTeam.users.find((user) => user.id === auth.user?.id);

    if (!isMember) {
      return response.forbidden(new ErrorResponse("Erişim izni yok!", 403));
    }

    findTeam.serialize();

    return response.ok(
      new SuccessResponse("Başarılı!", 200, {
        ...findTeam.toJSON(),
      })
    );
  }

  async postLike(ctx: HttpContextContract) {
    const { request, response, auth } = ctx;

    if (!request.hasBody()) {
      throw new NoBodyException();
    }

    const { postId } = request.body();

    if (!postId) {
      return response.badRequest(
        new ErrorResponse("Lütfen geçerli bir gönderi id gönderin!", 400)
      );
    }

    const post = await Post.findBy("id", postId);

    if (!post) {
      return response.notFound(new ErrorResponse("Gönderi bulunamadı!", 404));
    }

    const findPostLike = await PostLikes.findBy("post_id", postId);

    if (findPostLike && findPostLike.authorId === auth.user?.id) {
      return response.badRequest(new ErrorResponse("Zaten beğendin!", 400));
    }

    await PostLikes.create({
      authorId: auth.user?.id,
      postId,
    });

    await post.load("likes");

    return response.ok(
      new SuccessResponse("", 200, {
        post,
      })
    );
  }

  async postUnlike(ctx: HttpContextContract) {
    const { request, response, auth } = ctx;

    if (!request.hasBody()) {
      throw new NoBodyException();
    }

    const { postId } = request.body();

    if (!postId) {
      return response.badRequest(
        new ErrorResponse("Lütfen geçerli bir gönderi id gönderin!", 400)
      );
    }

    const post = await Post.findBy("id", postId);

    if (!post) {
      return response.notFound(new ErrorResponse("Gönderi bulunamadı!", 404));
    }

    const findPostLike = await PostLikes.query().where({
        author_id: auth.user?.id,
        post_id:postId
    }).first();

    if (!findPostLike) {
      return response.badRequest(
        new ErrorResponse("Bu gönderi daha önce beğenilmemiş!", 400)
      );
    }

    if(findPostLike.authorId !== auth.user?.id) {
        return response.badRequest(new ErrorResponse('Bir problem oluştu.',400))
    }

    await findPostLike.delete();

    await post.load("likes");

    return response.ok(
      new SuccessResponse("", 200, {
        post,
      })
    );
  }

  async deletePost(ctx: HttpContextContract) {
    const { request, response, auth } = ctx;

    const { postId } = request.qs();

    if (!postId) {
      return response.badRequest(
        new ErrorResponse("Lütfen geçerli bir id gönderin", 400)
      );
    }

    const post = await Post.findBy("id", postId);

    if (!post || post.authorId !== auth.user?.id) {
      return response.notFound(new ErrorResponse("Takım bulunamadı", 404));
    }

    await post.delete();

    return response.ok(new SuccessResponse("Gönderi kaldırıldı", 200));
  }

  async addComment(ctx: HttpContextContract) {
    const { request, response, auth } = ctx;

    if (!request.hasBody()) {
      throw new NoBodyException();
    }

    await request.validate(new CreateCommentValidator(ctx));

    const { postId, comment } = request.body();

    const post = await Post.query()
      .where({
        id: postId,
      })
      .first();

    if (!post) {
      return response.notFound(new ErrorResponse("Gönderi bulunamadı!", 404));
    }

    if(post.isComments === false) {
        return response.badRequest(new ErrorResponse('Bu gönderinin yorumları kapalı!',400))
    }

    const user = await User.findBy("id", auth.user?.id);

    if (!user) {
      return response.notFound(new ErrorResponse("Kullanıcı bulunamadı!", 404));
    }

    const newComment = await PostComments.create({
      comment,
      postId,
    });

    await newComment.related("user").associate(user);

    await newComment.load('user');

    return response.ok(
      new SuccessResponse("Yorum paylaşıldı!", 200, {
        comment: {
            ...newComment.toJSON()
        },
      })
    );
  }


  async deleteComment(ctx:HttpContextContract) {

    const {request,response,auth} = ctx;

    const {commentId,postId} = request.qs();

    if(!commentId || !postId) {
        return response.badRequest(new ErrorResponse('Yorum silinemedi.Hatalı istek!',400));
    }

    const findComment = await PostComments.query().where({
        postId,
        id:commentId
    }).first();

    
    if(!findComment) {
        return response.notFound(new ErrorResponse('Yorum bulunamadı!',404));
    }

    if(findComment.userId != auth.user?.id) {
        return response.forbidden(new ErrorResponse('Size ait olmayan yorumu silemezsiniz!',403));
    }

    await findComment.delete();

    return response.ok(new SuccessResponse('Başarılı',200))
  }



  async getAllPosts(ctx:HttpContextContract) {

    const {request,response} = ctx;

    const {page} = request.qs();
    
    const posts = await Post.query().orderBy('created_at','desc')
    .preload('comments',(comments) => {
      comments.preload('user');
    })
    .preload('likes')
    .preload('team',(team) => {
      team.preload('users')
    }).paginate(page ? page : 1,10)

    return response.ok(new SuccessResponse('Gönderiler yüklendi!',200,{
      ...posts.toJSON()
    }))
  }
}
