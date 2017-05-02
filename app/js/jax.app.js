/**
 * jax.app.js
 */

(function(window){
    window.app = {
        "isError"     : false,
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
        "getScopeLength" : function() {
            var length = 0;
            for (var key in window.$scope) {
                if (window.$scope[key] != undefined) {
                    length++;
                }
            }
            return length;
        },
        "addService" : function(name, service) {
            window.$services[name] = service;
        },
        "hasService" : function(name) {
            return (window.$services[name] != undefined);
        },
        "getService" : function(name) {
            return (window.$services[name] != undefined) ? window.$services[name] : null;
        },
        "removeService" : function(name) {
            if (window.app.hasService(name)) {
                window.$services[name] = undefined;
                delete window.$services[name];
            }
        },
        "prepareView" : function() {
            window.app.view = null;
            if ((!window.app.isError) && (jax.http.isSuccess('/views/' + app.router.getView()))) {
                window.app.view = jax.http.get('/views/' + app.router.getView());
            } else if ((window.app.isError) && (window.app.router.errorView != null) &&
                (window.app.router.errorView != undefined) && (jax.http.isSuccess('/views/' + window.app.router.errorView))) {
                window.app.view = jax.http.get('/views/' + window.app.router.errorView);
            }
        },
        "bind" : function(id) {
            var view = window.app.view;
            $(id)[0].innerHTML = view;

            for (var key in window.$scope) {
                if (view.indexOf('[{' + key + '}]') != -1) {
                    $(id)[0].innerHTML = $(id)[0].innerHTML.replace(new RegExp("\\[{" + key + "}\\]", 'g'), '<span data-jax-model="' + key + '">' + window.$scope[key] + '</span>');
                }
                var models = $("[data-jax-model='" + key + "']");
                for (var i = 0; i < models.length; i++) {
                    if ((models[i].nodeName == 'INPUT') || (models[i].nodeName == 'SELECT')) {
                        $(models[i]).val(window.$scope[key]);
                    } else {
                        models[i].innerHTML = window.$scope[key];
                    }
                    if ((models[i].nodeName == 'INPUT') || (models[i].nodeName == 'TEXTAREA')) {
                        $(models[i]).keyup(window.app.updateModels);
                    } else if (models[i].nodeName == 'SELECT') {
                        $(models[i]).change(window.app.updateModels);
                    }
                }
            }
        },
        "updateModels" : function() {
            var key = $(this).data('jax-model');
            window.$scope[key] = $(this).val();
            if ((key != null) && (key != undefined)) {
                var models = $("[data-jax-model='" + key + "']");
                for (var i = 0; i < models.length; i++) {
                    if ((models[i].nodeName == 'INPUT') || (models[i].nodeName == 'SELECT')) {
                        $(models[i]).val(window.$scope[key]);
                    } else {
                        models[i].innerHTML = window.$scope[key];
                    }
                }
            }
        },
        "send" : function(id) {
            if (id == undefined) {
                id = '#my-app';
            }
            window.app.prepareView();
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
                window.app.isError = true;
                window.app.getController(window.app.router.error).call();
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
    window.$scope    = {};
    window.$services = {
        "location" : window.location,
        "http"     : window.jax.http,
        "browser"  : window.jax.browser,
        "cookie"   : window.jax.cookie,
        "storage"  : window.jax.storage
    }
})(window);

$(window).on('hashchange', window.app.run);
