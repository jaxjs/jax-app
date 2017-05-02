Jax Single-Page Application
===========================

`jax-app` is a simple, single-page application MVC framework that
utilizes common Javascript Bootstrap and jQuery

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
app.controller('Index', function(){
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

SERVICES
--------

By default, the service container has the following services available:

- ``$services.location``
- ``$services.http``
- ``$services.browser``
- ``$services.cookie``
- ``$services.storage``

You can add your own service to the service container like this:

```js
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

