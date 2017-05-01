/**
 * controllers.js
 */

app.controller('Index', function(){
    console.log('Index page');
    app.prepareView();
    $scope.username = 'testuser';
    app.setTitle('Hello World : Home Page');
    app.send();
});

app.controller('Login', function(){
    console.log('Login page');
    app.prepareView();
    app.setTitle('Hello World : Login Page');
    app.send();
});

app.controller('Logout', function(){
    console.log('Logout');
    app.setTitle('Hello World : Logout Page');
});

app.controller('Users', function(){
    console.log('Users page');
    app.setTitle('Hello World : Users Page');
});

app.controller('UsersEdit', function(id){
    console.log('Users edit page ' + id);

    app.setTitle('Hello World : Users edit page ' + id);
});

app.controller('Error', function(){
    console.log('Error');
    app.setTitle('Hello World : Error Page');
});