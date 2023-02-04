import Route from "@ioc:Adonis/Core/Route";



Route.group(() => {
    Route.post('/create','TeamsController.createTeam').middleware('auth');
    Route.post('/join','TeamsController.joinTeam').middleware('auth');
    Route.post('/join-confirm-reject','TeamsController.joinTeamConfirmReject').middleware('auth');
    Route.get('/my','TeamsController.myTeams').middleware('auth');
    Route.get('/get-members','TeamsController.getMembers').middleware('auth');
    Route.delete('/delete','TeamsController.deleteTeam').middleware('auth');
    Route.get('/edit-team','TeamsController.editTeam').middleware('auth');
    Route.put('/update','TeamsController.updateTeam').middleware('auth');
    Route.delete('/remove-member','TeamsController.removeMember').middleware('auth');

}).prefix('/team')