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
    app.setTitle('Hello World : Login Page');
    app.send();
});

app.controller('Logout', function() {
    app.redirect('/#/login');
});

app.controller('Users', function() {
    $services.nav('on');
    app.setTitle('Hello World : Users Page');
    $scope.username = 'testuser';
    $scope.foo = $services.foo();
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