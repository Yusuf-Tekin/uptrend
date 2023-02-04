import Env from "@ioc:Adonis/Core/Env";
import Application from "@ioc:Adonis/Core/Application";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import NoBodyException from "App/Exceptions/NoBodyException";
import ErrorResponse from "App/Helper/Response/ErrorResponse";
import SuccessResponse from "App/Helper/Response/SuccessResponse";
import Team from "App/Models/Team";
import User from "App/Models/User";
import UserTeam from "App/Models/UserTeam";
import CreateTeamValidator from "App/Validators/CreateTeamValidator";
import JoinRequestValidator from "App/Validators/JoinRequestValidator";
import JoinTeamValidator from "App/Validators/JoinTeamValidator";
import TeamRoles from "App/Helper/Enums/TeamRoles";
import fs from "fs";
import UpdateTeamValidator from "App/Validators/UpdateTeamValidator";

export default class TeamsController {
  async myTeams(ctx: HttpContextContract) {
    const { auth, response } = ctx;

    const user = auth.user;

    if (!user) {
      return response.unauthorized(
        new ErrorResponse("Lütfen tekrardan oturum açın!", 401)
      );
    }

    const userId = user.id;

    const users = await Team.query()
      .preload('users')
      .preload("posts", (posts) => {
        posts.preload("comments");
        posts.preload("likes");
      })
      .preload('messages',(messages) => {
        messages.preload('user')
      })
      .where({
        author_id: userId,
      });

    const result = users.map((user) => user.serialize());
    // const findTeams = await Database.query().from('user_teams')
    // .select("user_teams.*")
    // .rightJoin("users","users.id","user_teams.user_id")
    // .rightJoin("teams","teams.id","user_teams.team_id")
    // .select("teams.*")

    return response.ok(
      new SuccessResponse("", 200, {
        result,
      })
    );
  }

  async createTeam(ctx: HttpContextContract) {
    const { request, response, auth } = ctx;

    if (request.hasBody()) {
      await request.validate(new CreateTeamValidator(ctx));

      const { name, about } = request.body();
      const image = request.file("image");
      const { user } = auth;

      const now = await Date.now();

      const newTeamName = `${now}-team.${image?.extname}`;

      const team = await Team.create({
        about,
        name,
        author_id: user?.id,
        image: image
          ? `/uploads/teams/profileImage/${newTeamName}`
          : "/uploads/teams/profileImage/default.png",
      });

      if (!user) {
        return response.notFound(new ErrorResponse('Kullanıcı bulunamadı',404));
      }

      await UserTeam.create({
        isConfirmed: true,
        teamId: team.id,
        userId: user.id,
        role: TeamRoles.FOUNDER,
      });

      await image?.move(Application.tmpPath("uploads/teams/profileImage"), {
        name: image ? newTeamName : undefined,
        overwrite: true,
      });

      await team.load("users");
      await team.load("posts")

      return response.ok(
        new SuccessResponse("Takımınız oluşturuldu.", 200, {
          ...team.toJSON(),
        })
      );
    } else {
      throw new NoBodyException();
    }
  }

  async joinTeam(ctx: HttpContextContract) {
    const { request, response, auth } = ctx;

    if (!request.hasBody()) {
      throw new NoBodyException();
    }

    await request.validate(new JoinTeamValidator(ctx));

    const { user_id, team_id, role } = request.body();

    const findUser = await User.findBy("id", user_id);

    if (!findUser) {
      return response.notFound(new ErrorResponse("Kullanıcı bulunamadı", 404));
    }

    const findTeam = await Team.findBy("id", team_id);

    if (!findTeam) {
      return response.notFound(new ErrorResponse("Takım bulunamadı", 404));
    }

    if(findUser.id !== auth.user?.id) {
      return response.forbidden(new ErrorResponse("Başka birisi için takıma katılma isteğinde bulunamazsın", 403));
    }

    const oldRequest = await UserTeam.query()
      .where({
        user_id: user_id,
        team_id,
      })
      .first();

    if (oldRequest) {
      return response.notAcceptable(
        new ErrorResponse("Halihazırda cevap bekleyen bir isteğiniz var!", 406)
      );
    }

    await UserTeam.create({
      role,
      teamId: findTeam.id,
      userId: findUser.id,
    });

    // Kullanıcının Takımlarını Getirme

    // const allRequests = await User.query().preload('teams')

    // const result = allRequests.map(request => request.serialize());

    // Bir kullanıcının oluşturduğu takıma gelen istekler
    // const allRequestsMyTeam = await Database.rawQuery(
    //   "SELECT teams.*,users.* FROM user_teams INNER JOIN teams ON user_teams.team_id = teams.id INNER JOIN users ON user_teams.user_id = users.id WHERE is_confirmed=0"
    // );

    return response.ok(new SuccessResponse("Katılma isteği gönderildi", 200));
  }

  async joinTeamConfirmReject(ctx: HttpContextContract) {
    const { request, response } = ctx;

    if (!request.hasBody()) {
      throw new NoBodyException();
    }

    await request.validate(new JoinRequestValidator(ctx));

    const { user_id, team_id, type } = request.body();

    const findUserTeam = await UserTeam.query()
      .where({
        user_id: user_id,
        team_id: team_id,
      })
      .first();

    if (!findUserTeam) {
      return response.notFound(
        new ErrorResponse("Bir problem oluştu.İstek bulunamadı.", 404)
      );
    }
    if (type !== "accept" && type !== "reject") {
      return response.badRequest(
        new ErrorResponse(
          "İsteğe verilen cevap geçersiz.Lütfen geçerli bir yanıt verin."
        )
      );
    }

    if (type == "accept") {
      findUserTeam.isConfirmed = await true;
      await findUserTeam?.save();
      return response.ok(new SuccessResponse("Takıma yeni biri katıldı.", 200));
    }

    await findUserTeam.delete();
    return response.ok(
      new SuccessResponse("Takıma katılma isteği reddedildi", 200)
    );
  }

  async getMembers({ request, response, auth }: HttpContextContract) {
    const { teamId } = request.qs();

    if (!teamId) {
      return response.badRequest(
        new ErrorResponse("Takım Id'si gönderin", 400)
      );
    }

    const findTeam = await Team.findBy("id", teamId);

    if (!findTeam) {
      return response.badRequest(new ErrorResponse("Takım bulunamadı!", 400));
    }

    await findTeam.load("users");

    const isMember = findTeam.users
      .find((user) => user.id === auth.user?.id)
      ?.toJSON();

    if (findTeam.author_id !== auth.user?.id && isMember === null) {
      return response.forbidden(new ErrorResponse("Erişim yetkiniz yok!", 403));
    }

    const members = await Database.from("user_teams")
      .select("user_teams.role as team_role")
      .where({
        is_confirmed: true,
      })
      .rightJoin("users", "user_teams.user_id", "users.id")
      .select(
        "users.id",
        "users.fullname",
        "users.username",
        "users.email",
        "users.created_at",
        "users.profile_image",
        "users.is_block",
        "users.role as user_role"
      )
      .where({
        team_id: teamId,
      });

    return response.ok(new SuccessResponse("Başarılı!", 200, members));
  }

  async deleteTeam({ request, response, auth }: HttpContextContract) {
    const { teamId } = request.qs();

    if (!teamId) {
      return response.badRequest(
        new ErrorResponse("Lütfen takım id bilgisi gönderin!", 400)
      );
    }

    const findTeam = await Team.findBy("id", teamId);

    if (!findTeam) {
      return response.badRequest(new ErrorResponse("Takım bulunamadı!", 400));
    }

    if (findTeam.author_id != auth.user?.id) {
      return response.badRequest(
        new ErrorResponse("Size ait olmayan takımı silemezsiniz!", 400)
      );
    }

    const dir = Env.get("DIR");
    const imageName = findTeam.image.split("/")[4];

    if (imageName != "default.png") {
      await fs.unlink(`${dir}/tmp/${findTeam.image}`, () => {
        return response.internalServerError(
          new ErrorResponse("Bir problem oluştu.Takım silinemedi.", 500)
        );
      });
    }

    await findTeam.delete();

    return response.ok(new SuccessResponse("Takım silindi", 200));
  }

  async editTeam(ctx: HttpContextContract) {
    const { request, response, auth } = ctx;

    const { teamId } = request.qs();

    if (!teamId) {
      return response.badRequest(new ErrorResponse("Takım Id gönerin!"));
    }

    const findTeam = await Team.findBy("id", teamId);

    if (!findTeam) {
      return response.notFound(new ErrorResponse("Takım bulunamadı!", 404));
    }

    if (findTeam.author_id !== auth.user?.id) {
      return response.forbidden(new ErrorResponse("Yetkisiz Erişim", 403));
    }

    await findTeam.load("users");

    return response.ok(
      new SuccessResponse("Başarılı!", 200, {
        ...findTeam.toJSON(),
      })
    );
  }

  async updateTeam(ctx: HttpContextContract) {
    const { request, response, auth } = ctx;

    if (!request.hasBody()) {
      throw new NoBodyException();
    }

    await request.validate(new UpdateTeamValidator(ctx));

    const { teamName, teamAbout, isActive, teamId } = request.body();
    const image = request.file("image");

    const findTeam = await Team.findBy("id", teamId);
    if (!findTeam) {
      return response.notFound(new ErrorResponse("Takım bulunamadı!", 404));
    }
    if (findTeam.author_id !== auth.user?.id) {
      return response.forbidden(
        new ErrorResponse(
          "Size ait olmayan bir takımı güncelleyemezsiniz!",
          403
        )
      );
    }

    const findTeamByName = await Team.findBy("name", teamName);

    if (findTeamByName) {
      if (findTeamByName.id !== parseInt(teamId)) {
        return response.badRequest(
          new ErrorResponse("Bu takım adı kullanılamaz", 400)
        );
      }
    }

    findTeam.name = teamName;
    findTeam.about = teamAbout;

    if (isActive !== "true" && isActive !== "false") {
      return response.badRequest(
        new ErrorResponse("Lütfen geçerli bir aktiflik verisi gönderin!", 400)
      );
    }
    findTeam.is_active = isActive === "true" ? true : false;

    const imageSplit = findTeam.image.split("/");
    const newName = imageSplit[imageSplit.length - 1];

    await image?.move(Application.tmpPath("uploads/teams/profileImage"), {
      name: image ? newName : undefined,
      overwrite: true,
    });

    await findTeam.save();

    await findTeam.load("users");
    await findTeam.load('messages',(messages) => {
      messages.preload('team')
      messages.preload('user')
      messages.orderBy('created_at','desc')
    })

    await findTeam.load('posts',(posts) => {
      posts.preload('comments',(comments) => {
        comments.preload('user')
      })
      posts.preload('likes')
      posts.orderBy('created_at','desc')

    })

    return response.ok(
      new SuccessResponse("Güncelleme tamamlandı!", 200, {
        ...findTeam.toJSON(),
        is_active:findTeam.is_active ? 1 : 0
      })
    );
  }

  async removeMember(ctx: HttpContextContract) {
    const { request, response, auth } = ctx;

    const { teamId, memberId } = request.qs();

    if(!teamId) {
      return response.badRequest(new ErrorResponse('Takım id bilgisi gönderin',400))
    }

    if(!memberId) {
      return response.badRequest(new ErrorResponse('Üye id bilgisi gönderin',400))
    }

    const findMember = await UserTeam.query().where({
      teamId,
      userId:memberId
    }).first();
    
    if (!findMember) {
      return response.notFound(new ErrorResponse("Kullanıcı bulunamadı!", 404));
    }

    const findTeam = await Team.findBy("id", findMember.teamId);

    if (!findTeam) {
      return response.notFound(new ErrorResponse("Takım bulunamadı!", 404));
    }

    if (findTeam.author_id !== auth.user?.id) {
      return response.forbidden(
        new ErrorResponse("Size ait olmayan takımdan bir üye silemezsiniz", 403)
      );
    }

    findMember.delete();

    return response.ok(new SuccessResponse("Üye takımdan kaldırıldı", 200));
  }
}
