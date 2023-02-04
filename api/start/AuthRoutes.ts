import Route from '@ioc:Adonis/Core/Route';


Route.group(() => {
    Route.post('/signup','AuthController.signup');
    Route.post('/signin','AuthController.signin');
    Route.post('/forgot-password','AuthController.forgotPassword');
    Route.get('/verify-user-account','AuthController.verifyUserEmail');
    Route.get('/logout','AuthController.logout').middleware('auth')
    Route.get('/check','AuthController.authCheck');


}).prefix('/auth')