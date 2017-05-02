/**
 * controllers.js
 */

app.controller('Index', function(){
    $scope.username = 'testuser';
    app.setTitle('Hello World : Home Page');
    app.send();
});

app.controller('Login', function(){
    app.setTitle('Hello World : Login Page');
    app.send();
});

app.controller('Logout', function(){
    app.setTitle('Hello World : Logout Page');
    app.send();
});

app.controller('Users', function(){
    app.setTitle('Hello World : Users Page');
    $scope.username = 'testuser';
    $scope.foo = $services.foo();
    app.send();
});

app.controller('UsersEdit', function(id){
    $scope.user_id  = id;
    $scope.username = 'testuser';
    app.setTitle('Hello World : Users edit page ' + id);
    app.send();
});

app.controller('Error', function(){
    app.setTitle('Hello World : Error Page');
    $scope.username = 'testuser';
    app.send();
});