/**
 * routes.js
 */

app.router.add('/', {
    "controller" : 'Index',
    "view"       : 'index.html'
});

app.router.add('/login', {
    "controller" : 'Login',
    "view"       : 'login.html',
    "complete"   : function(){
        $(app.config.appId).fadeIn(500);
    }
});

app.router.add('/logout', {
    "controller" : 'Logout'
});

app.router.add('/users', {
    "controller" : 'Users',
    "view"       : 'users.html'
});

app.router.add('/users/:id', {
    "controller" : 'UsersEdit',
    "view"       : 'users-edit.html'
});

app.router.addErrorRoute({
    "controller" : 'Error',
    "view"       : 'error.html'
});