/**
 * app.js
 */

(function(window){
    window.app = {
        "router" : {
            "routes"  : [],
            "params"  : [],
            "matched" : null,
            "add"     : function(route, controller) {
                var params = route.match(/\/\:+\w*/g);
                if ((params != null) && (params.length > 0)) {
                    for (var i = 0; i < params.length; i++) {
                        route = route.replace(params[i], '/.[a-zA-Z0-9_-]*')
                    }
                }
                window.app.router.routes[route] = controller;
            },
            "hasRoute"  : function(route) {
                for (var pattern in window.app.router.routes) {
                    if (pattern.indexOf('/.') != -1) {
                        var regex = new RegExp(pattern);
                        if (regex.test(route)) {
                            window.app.router.matched = pattern;
                        }
                    } else if (pattern == route) {
                        window.app.router.matched = pattern;
                    }
                }
                return (window.app.router.matched != null);
            },
            "getRoute"  : function(route) {
                if (window.app.router.matched == null) {
                    window.app.router.hasRoute(route);
                }
                return (window.app.router.matched != null) ?
                    window.app.router.routes[window.app.router.matched] : null;
            }
        },
        "dispatch" : function(route) {
            if (window.app.router.hasRoute(route)) {
                var params = [];
                if (window.app.router.matched.indexOf('/.') != -1) {
                    var stem = window.app.router.matched.substring(0, window.app.router.matched.indexOf('/.') + 1);
                    params = route.substring(stem.length).split('/');
                }
                if (params.length > 0) {
                    console.log(params);
                    window.app.router.getRoute(route).apply(null, params);
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