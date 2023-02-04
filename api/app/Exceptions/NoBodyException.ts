import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { Exception } from '@adonisjs/core/build/standalone'
import ErrorResponse from 'App/Helper/Response/ErrorResponse';

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new NoBodyException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class NoBodyException extends Exception {

  constructor() {
    super("Hatalı istek!")
  }
    
  public async handle(error: any, ctx: HttpContextContract) {
      return ctx.response.badRequest(new ErrorResponse(error.message,400));
  }
}
