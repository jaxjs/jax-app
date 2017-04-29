/**
 * controllers.js
 */

app.controller('Index', function(){
    console.log('Index page');
    app.prepareView();
});

app.controller('Login', function(){
    console.log('Login page');
    app.prepareView();
});

app.controller('Logout', function(){
    console.log('Logout');
});

app.controller('Users', function(){
    console.log('Users page');
});

app.controller('UsersEdit', function(id){
    console.log('Users edit page ' + id);
});

app.controller('Error', function(){
    console.log('Error');
});