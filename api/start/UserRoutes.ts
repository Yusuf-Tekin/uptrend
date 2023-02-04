import Route from '@ioc:Adonis/Core/Route';


Route.group(() => {
    Route.get('/profile','UsersController.profile').middleware(['auth'])

}).prefix('/user')