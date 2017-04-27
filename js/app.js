/**
 * app.js
 */

(function(window){
    window.app = {
        "router" : {
            "routes" : [],
            "params" : [],
            "add"    : function(route, controller) {
                var params = route.match(/\/\:+\w*/g);
                if ((params != null) && (params.length > 0)) {
                    for (var i = 0; i < params.length; i++) {
                        route = route.replace(params[i], '/.[a-zA-Z0-9_-]*')
                    }
                }
                window.app.router.routes[route] = controller;
            },
            "hasRoute"  : function(route) {
                var matchedRoute = null;
                for (var pattern in window.app.router.routes) {
                    var regex = new RegExp(pattern);
                    if (regex.test(route)) {
                        matchedRoute = pattern;
                    }
                }
                return (matchedRoute != null);
            },
            "getRoute"  : function(route) {
                var matchedRoute = null;
                for (var pattern in window.app.router.routes) {
                    var regex = new RegExp(pattern);
                    if (regex.test(route)) {
                        matchedRoute = window.app.router.routes[pattern];

                    }
                }
                return matchedRoute;
            }
        },
        "dispatch" : function(route) {
            if (window.app.router.hasRoute(route)) {
                if (params != undefined) {
                    window.app.router.getRoute(route).apply(params);
                } else {
                    window.app.router.getRoute(route).call();
                }
            } else if (window.app.router.hasRoute('error')) {
                window.app.router.getRoute('error').call();
            }
        },
        "run" : function() {
            var route = window.location.hash.substring(1);
            if (route == '') {
                route = '/';
            }
            window.app.dispatch(route);
        }
    };
})(window);

app.router.add('/', function(){
    alert('Index page');
});

app.router.add('/login', function(){
    alert('Login page');
});

app.router.add('/logout', function(){
    alert('Logout');
});

app.router.add('/users', function(){
    alert('Users page');
});

app.router.add('/users/:id', function(id){
    alert('Users edit page ' + id);
});

app.router.add('error', function(){
    alert('Error');
});


$(window).on('hashchange', window.app.run);

$(document).ready(function(){
    console.log('Page load');
    app.run();
});