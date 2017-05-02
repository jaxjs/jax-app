/**
 * controllers.js
 */

app.controller('Index', function() {
    $scope.username = 'testuser';
    $services.nav('on');
    app.setTitle('Hello World : Home Page');
    app.send();
});

app.controller('Login', function() {
    $services.nav('off');
    $(app.config.appId).hide();
    app.setTitle('Hello World : Login Page');
    app.send();
});

app.controller('Logout', function() {
    app.redirect('/#/login');
});

app.controller('Users', function() {
    $scope.username = 'testuser';
    $scope.foo      = $services.foo();
    $scope.users    = [
        {
            "id"       : 1001,
            "username" : "testuser1",
            "email"    : "test1@test.com"
        },
        {
            "id"       : 1002,
            "username" : "testuser2",
            "email"    : "test2@test.com"
        },
        {
            "id"       : 1003,
            "username" : "testuser3",
            "email"    : "test3@test.com"
        }
    ];

    $services.nav('on');
    app.setTitle('Hello World : Users Page');
    app.send();
});

app.controller('UsersEdit', function(id) {
    $services.nav('on');
    $scope.user_id  = id;
    $scope.username = 'testuser';
    app.setTitle('Hello World : Users edit page ' + id);
    app.send();
});

app.controller('Error', function() {
    $services.nav('off');
    app.setTitle('Hello World : Error Page');
    $scope.username = 'testuser';
    app.send();
});