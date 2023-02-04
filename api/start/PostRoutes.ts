import Route from '@ioc:Adonis/Core/Route';


Route.group(() => {


    Route.post('/create','PostsController.createPost').middleware('auth');
    Route.get('/team-posts','PostsController.getTeamPosts').middleware('auth');
    Route.post('/post-like','PostsController.postLike').middleware(['auth','throttle:global']);
    Route.post('/post-unlike','PostsController.postUnlike').middleware(['auth','throttle:global'])

    Route.delete('/delete','PostsController.deletePost').middleware('auth');

    Route.post('/add-comment','PostsController.addComment').middleware('auth');
    Route.delete('/delete-comment','PostsController.deleteComment').middleware('auth');

    Route.get('/get-all','PostsController.getAllPosts').middleware('auth');





}).prefix('/post')