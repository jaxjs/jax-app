/**
 * jax.app.js
 */

(function(window){
    window.app = {
        "controllers" : [],
        "controller"  : function(name, controller) {
            window.app.controllers[name] = controller;
        },
        "hasController" : function(name) {
            return (window.app.controllers[name] != undefined);
        },
        "getController" : function(name) {
            return (window.app.controllers[name] != undefined) ? window.app.controllers[name] : null;
        },
        "setTitle"    : function(title) {
            document.title = title;
        },
        "prepareView" : function() {
            window.app.view = jax.http.get('/views/' + app.router.getView());
        },
        "bind" : function(id) {
            var view = window.app.view;
            //console.log(window.$scope.username);
            for (var key in window.$scope) {
                if (view.indexOf('[{' + key + '}]') != -1) {
                    $(id)[0].innerHTML = view.replace(new RegExp("\\[{" + key + "}\\]", 'g'), window.$scope[key]);
                    var models = $("[data-jax-model='" + key + "']");
                    for (var i = 0; i < models.length; i++) {
                        if (models[i].nodeName == 'INPUT') {
                            $(models[i]).val(window.$scope[key]);
                        } else {
                            models[i].innerHTML = window.$scope[key];
                        }
                        if ((models[i].nodeName == 'INPUT') || (models[i].nodeName == 'TEXTAREA')) {
                            $(models[i]).keyup((function (k, m) {
                                return function () {
                                    window.$scope[key] = this.value;
                                    window.app.bind(id);
                                    //this.focus();
                                    //$(id)[0].onload = function(m) {
                                    //    m.focus();
                                    //};
                                    //console.log(m.nodeName);
                                }
                            }(key, models[i])));
                        }
                    }
                }
            }
        },
        "send" : function(id) {
            if (id == undefined) {
                id = '#my-app';
            }
            window.app.bind(id);
        },
        "view"          : null,
        "router"        : {
            "routes"    : [],
            "views"     : [],
            "error"     : null,
            "errorView" : null,
            "matched"   : null,
            "add"       : function(url, route) {
                var params = url.match(/\/\:+\w*/g);
                if ((params != null) && (params.length > 0)) {
                    for (var i = 0; i < params.length; i++) {
                        url = url.replace(params[i], '/.[a-zA-Z0-9_-]*')
                    }
                }
                if (route.controller == undefined) {
                    throw new Error('Controller not defined.');
                }
                window.app.router.routes[url] = route.controller;
                if ((route.view != null) && (route.view != undefined)) {
                    window.app.router.views[url] = route.view;
                }
            },
            "addErrorRoute" : function(route) {
                if (route.controller == undefined) {
                    throw new Error('Controller not defined.');
                }
                window.app.router.error = route.controller;
                if ((route.view != null) && (route.view != undefined)) {
                    window.app.router.errorView = route.view;
                }
            },
            "hasErrorRoute" : function() {
                return (window.app.router.error != null);
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
                if (window.app.router.matched != null) {
                    var ctrl = window.app.router.routes[window.app.router.matched];
                    return (window.app.hasController(ctrl)) ?
                        window.app.getController(ctrl) : null;
                } else {
                    return null;
                }
            },
            "getView"  : function() {
                return (window.app.router.matched != null) ?
                    window.app.router.views[window.app.router.matched] : null;
            },
            "hasView"  : function() {
                return ((window.app.router.matched != null) && (window.app.router.views[window.app.router.matched] != undefined));
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
                    window.app.router.getRoute(route).apply(null, params);
                } else {
                    window.app.router.getRoute(route).call();
                }
            } else if (window.app.router.hasErrorRoute()) {
                window.app.router.error.call();
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
    window.$scope = {};
})(window);

$(window).on('hashchange', window.app.run);
