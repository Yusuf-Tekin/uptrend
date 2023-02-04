import { Limiter } from "@adonisjs/limiter/build/services";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import NoBodyException from "App/Exceptions/NoBodyException";
import Hash from "App/Helper/Hash/Hash";
import ErrorResponse from "App/Helper/Response/ErrorResponse";
import SuccessResponse from "App/Helper/Response/SuccessResponse";
import User from "App/Models/User";
import UserVerify from "App/Models/UserVerify";
import AuthValidator from "App/Validators/AuthValidator";
import CreateUserValidator from "App/Validators/CreateUserValidator";
import { DateTime } from "luxon";

export default class AuthController {
  async signin(ctx: HttpContextContract) {
    const { request, response, auth } = ctx;
    const errorMessage = "Kullanıcı adı ya da şifre hatalı";

    if (request.hasBody()) {
      await request.validate(new AuthValidator(ctx));

      const { username, password } = request.body();

      const throttleKey = `login_${username}_${request.ip()}`;

      const limiter = Limiter.use({
        requests: 3,
        duration: "10 mins",
        blockDuration: "1 hours",
      });

      const isLimited = await limiter.isBlocked(throttleKey);

      if (isLimited) {
        return response.tooManyRequests(
          new ErrorResponse(
            "Çok fazla hatalı giriş denemesi yaptınız.Lütfen biraz bekleyin!",
            429
          )
        );
      }

      const findUser = await User.findBy("username", username);

      if (!findUser) {
        return response.notFound(new ErrorResponse(errorMessage, 404));
      }

      if (!findUser.isVerify) {
        return response.forbidden(
          new ErrorResponse(
            "Lütfen hesabınızı doğrulayın.Doğrulama linki e-posta adresinize daha önce gönderilmiş.",
            403
          )
        );
      }


      try {
        const token = await auth.use("api").attempt(username, password, {
          expiresIn: "1 days",
        });
        findUser.serialize();
        await limiter.delete(throttleKey);

        return response.ok(
          new SuccessResponse("Giriş başarılı!", 200, {
            token: token.token,
            user: findUser,
          })
        );
      } catch (err) {
        await limiter.increment(throttleKey);
        return response.notFound(new ErrorResponse(errorMessage, 404));
      }
    }
    throw new NoBodyException();
  }

  async signup(ctx: HttpContextContract) {
    const { request, response } = ctx;

    if (request.hasBody()) {
      await request.validate(new CreateUserValidator(ctx));
      const user = await User.create({
        ...request.body(),
      });
      const token = Hash.createHashString();
      const userVerify = await UserVerify.create({
        token,
        expired_time: DateTime.now().plus({
          day: 1,
        }),
      });
      await user.related("userVerifyId").save(userVerify);
      await UserVerify.sendVerifyEmail(user, token);

      return response.json(
        new SuccessResponse(
          "Hesabınız oluşturuldu ve e-postanızı doğrulayabilmeniz için e-posta gönderildi."
        )
      );
    }
    throw new NoBodyException();
  }

  forgotPassword(ctx: HttpContextContract) {
    const { response } = ctx;

    response.send("Forgot Password");
  }

  async verifyUserEmail(ctx: HttpContextContract) {
    const { request, response } = ctx;

    const { token } = request.qs();

    if (token) {
      const findToken = await UserVerify.findBy("token", token);

      if (!findToken) {
        return response.notFound(new ErrorResponse("Token bulunamadı", 404));
      }

      if (
        DateTime.fromISO(DateTime.now().toISO()) >
        DateTime.fromISO(findToken.expired_time.toISO())
      ) {
        return response.forbidden(
          new ErrorResponse(
            "Token süresi dolmuş.Hesabınız onaylanamadı.Lütfen tekrar hesap oluşturun.",
            403
          )
        );
      }

      const findUser = await User.findBy("id", findToken.userId);

      if (!findUser) {
        return response.notFound(new ErrorResponse("Hesap bulunamadı.", 404));
      }
      findUser.isVerify = true;
      findUser.save();

      await findToken.delete();

      return response.ok(new SuccessResponse("Hesabınız onaylandı"));
    }

    return response.notFound(new ErrorResponse("Bulunamadı", 404));
  }

  async logout({ response, auth }: HttpContextContract) {
    await auth.use("api").revoke();
    return response.ok(new SuccessResponse("Oturum sonlandırıldı", 200));
  }

  async authCheck({ response, auth }: HttpContextContract) {
    await auth.use("api").check();

    if (auth.use("api").isLoggedIn) {
      return response.ok("");
    } else {
      return response.unauthorized();
    }
  }
}
