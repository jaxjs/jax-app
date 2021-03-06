Jax Single-Page Application
===========================

`jax-app` is a simple, single-page application MVC framework that
utilizes the common JavaScript libraries Bootstrap and jQuery

STRUCTURE
---------

A basic structure of an application might look like:

- /app
    + /js
    + app.js
    + controllers.js
    + routes.js
    + services.js
- /css
    + app.css
- /fonts
- /img
- /views
    + index.html
    + error.html
- index.html

The ``app.js`` script would need to minimally include:

```js
$(document).ready(function(){
    app.run();
});
```
And within the main ``index.html`` file, you would have:

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title></title>

    <link rel="stylesheet" href="css/bootstrap.min.css" />
    <link rel="stylesheet" href="css/bootstrap-theme.min.css" />
    <link rel="stylesheet" type="text/css" href="css/font-awesome.min.css" />
    <link rel="stylesheet" type="text/css" href="css/app.css" />

</head>

<body>
    <div id="my-app"></div>
    <script src="app/js/jquery-3.2.1.min.js"></script>
    <script src="app/js/bootstrap.min.js"></script>
    <script src="app/js/jax.5.5.0.min.js"></script>
    <script src="app/js/jax.app.js"></script>
    <script src="app/controllers.js"></script>
    <script src="app/routes.js"></script>
    <script src="app/services.js"></script>
    <script src="app/app.js"></script>
</body>

</html>
```

CONTROLLERS & ROUTES
--------------------

You can set up controllers like this:

```js
app.controller('Index', function() {
    $scope.username = 'testuser';
    app.setTitle('Hello World : Home Page');
    app.send();
});
```

And the add them to a route like this:

```js
app.router.add('/', {
    "controller" : 'Index',
    "view"       : 'index.html'
});
```

### Route Parameters

You can define route parameters to pass to your controller like this:

```js
app.controller('UsersEdit', function(id) {
    $scope.user_id = id;
    app.setTitle('Users edit page ' + id);
    app.send();
});
```

And your route would look like this:

```js
app.router.add('/users/:id', {
    "controller" : 'UsersEdit',
    "view"       : 'users-edit.html'
});
```

SERVICES
--------

By default, the service container has the following services available:

- ``$services.location``
- ``$services.http``
- ``$services.browser``
- ``$services.cookie``
- ``$services.storage``

You can add your own custom services to the service container like this:

```js
app.addService('nav', function(state) {
    if ((state == 'on') && (app.viewExists('nav.html'))) {
        app.setView('#my-app-header', app.getView('nav.html'));
    } else {
        app.setView('#my-app-header');
    }
});

app.addService('foo', function() {
    return 'Gimme some foo!';
});
```

BINDING MODELS
--------------

Within your view templates, you can bind the model to the view like this:

```html
    <h1>Welcome, [{username}]</h1>
    <div><input type="text" id="username1" data-jax-model="username" size="20"/></div>
```

