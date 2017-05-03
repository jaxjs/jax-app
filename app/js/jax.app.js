/**
 * jax.app.js
 */

(function(window){
    window.app = {
        "config"       : {
            "viewPath" : '/views/',
            "appId"    : '#my-app'
        },
        "isError"      : false,
        "controllers"  : [],
        "controller"   : function(name, controller) {
            window.app.controllers[name] = controller;
        },
        "hasController" : function(name) {
            return (window.app.controllers[name] != undefined);
        },
        "getController" : function(name) {
            return (window.app.controllers[name] != undefined) ? window.app.controllers[name] : null;
        },
        "setTitle" : function(title) {
            document.title = title;
        },
        "getTitle" : function() {
            return document.title;
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
        "viewExists" : function(view) {
            return jax.http.isSuccess(window.app.config.viewPath + view);
        },
        "getView" : function(view) {
            return jax.http.get(window.app.config.viewPath + view);
        },
        "setView" : function(id, view) {
            if ((view != null) && (view != undefined)) {
                window.app.bind(id, view);
            } else {
                $(id)[0].innerHTML = '';
            }
        },
        "prepareView" : function(id) {
            window.app.view     = null;
            window.app.complete = null;
            if ((!window.app.isError) && (app.router.getView() != undefined) &&
                (jax.http.isSuccess(window.app.config.viewPath + app.router.getView()))) {
                window.app.view = jax.http.get(window.app.config.viewPath + app.router.getView());
                if (app.router.hasComplete()) {
                    window.app.complete = app.router.getComplete();
                }
            } else if ((window.app.isError) && (window.app.router.errorView != null) &&
                (window.app.router.errorView != undefined) &&
                (jax.http.isSuccess(window.app.config.viewPath + window.app.router.errorView))) {
                window.app.view = jax.http.get(window.app.config.viewPath + window.app.router.errorView);
            } else if ((id != undefined) && (id != null)) {
                if (window.app.defaultView == null) {
                    window.app.defaultView = $(id)[0].innerHTML;
                }
                window.app.view = window.app.defaultView;
            }
        },
        "bind" : function(id, view) {
            if ((view == undefined) || (view == null)) {
                view = window.app.view;
            }
            $(id)[0].innerHTML = view;

            for (var key in window.$scope) {
                if (view.indexOf('[{' + key + '}]') != -1) {
                    $(id)[0].innerHTML = $(id)[0].innerHTML.replace(
                        new RegExp("\\[{" + key + "}\\]", 'g'),
                        '<span data-jax-model="' + key + '">' + window.$scope[key] + '</span>'
                    );
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

            var repeats = $("[data-jax-repeat]");

            for (var i = 0; i < repeats.length; i++) {
                var key = $(repeats[i]).attr('data-jax-repeat');
                if (window.$scope[key] != undefined) {
                    view = $(repeats[i])[0].innerHTML;
                    $(repeats[i])[0].innerHTML = '';
                    for (var j = 0; j < window.$scope[key].length; j++) {
                        var row  = view;
                        if (window.$scope[key][j].constructor == Object) {
                            for (var prop in window.$scope[key][j]) {
                                row = row.replace(new RegExp("\\[{" + prop + "}\\]", 'g'), window.$scope[key][j][prop]);
                            }
                        } else {
                            row = row.replace(new RegExp("\\[{i}\\]", 'g'), j + 1);
                            row = row.replace(new RegExp("\\[{value}\\]", 'g'), window.$scope[key][j]);
                        }
                        $(repeats[i]).append(row);
                    }
                }
            }

            if (window.app.complete != null) {
                window.app.complete.call();
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
                        if (models[i].nodeName == 'TEXTAREA') {
                            $(models[i]).val(window.$scope[key]);
                        }
                    }
                }
            }
        },
        "send" : function(id) {
            if ((id == undefined) || (id == null)) {
                id = window.app.config.appId;
            }
            window.app.prepareView(id);
            window.app.bind(id);
        },
        "complete"      : null,
        "view"          : null,
        "defaultView"   : null,
        "router"        : {
            "routes"    : [],
            "views"     : [],
            "completes" : [],
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
                if ((route.complete != null) && (route.complete != undefined)) {
                    window.app.router.completes[url] = route.complete;
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
            "hasRoute" : function(route) {
                window.app.router.matched = null;
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
            "getRoute" : function(route) {
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
            "getView" : function() {
                return (window.app.router.matched != null) ?
                    window.app.router.views[window.app.router.matched] : null;
            },
            "hasView" : function() {
                return ((window.app.router.matched != null) &&
                    (window.app.router.views[window.app.router.matched] != undefined));
            },
            "getComplete" : function() {
                return (window.app.router.matched != null) ?
                    window.app.router.completes[window.app.router.matched] : null;
            },
            "hasComplete" : function() {
                return ((window.app.router.matched != null) &&
                (window.app.router.completes[window.app.router.matched] != undefined));
            }
        },
        "redirect" : function(url) {
            window.$services.location.href = url;
        },
        "dispatch" : function(route) {
            if (window.app.router.hasRoute(route)) {
                window.app.isError = false;
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
            var route = (window.location.hash.length > 0) ?
                window.location.hash.substring(1) : window.location.pathname;
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
        "storage"  : window.jax.storage,
        "filter"   : {
            "stripTags" : function(str) {
                return str.replace(/<\/?[^>]+(>|$)/g, '');
            },
            "html" : function(str, quot, strict) {
                str = str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                if ((quot != undefined) && (quot != null)) {
                    str = str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
                }
                if ((strict != undefined) && (strict != null)) {
                    str = str.replace(/\(/g, '&#40;').replace(/\)/g, '&#41;').replace(/\//g, '&#47;')
                             .replace(/:/g, '&#58;').replace(/\[/g, '&#91;').replace(/\]/g, '&#93;')
                             .replace(/\\/g, '&#92;').replace(/{/g, '&#123;').replace(/}/g, '&#125;');
                }
                return str;
            },
            "dehtml" : function(str, quot, strict) {
                str = str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                if (quot != undefined) {
                    str = str.replace(/&quot;/g, '"').replace(/&#39;/g, "'");
                }
                if (strict != undefined) {
                    str = str.replace(/&#40;/g, '(').replace(/&#41;/g, ')').replace(/&#47;/g, '/')
                             .replace(/&#58;/g, ':').replace(/&#91;/g, '[').replace(/&#93;/g, ']')
                             .replace(/&#92;/g, '\\').replace(/&#123;/g, '{').replace(/&#125;/g, '}');
                }
                return str;
            },
            "links" : function(str, tar) {
                var matches = [];
                var targ    = (tar != null) ? ' target="_blank"' : '';

                var protocolMatches = this.match(/[f|ht]+tp:\/\/[^\s]*/g);
                var linkMatches     = this.match(/\s[\w]+[a-zA-Z0-9\.\-\_]+(\.[a-zA-Z]{2,4})/g);
                var mailMatches     = this.match(/[a-zA-Z0-9\.\-\_+%]+@[a-zA-Z0-9\-\_\.]+\.[a-zA-Z]{2,4}/g);

                if (protocolMatches[0] != undefined) {
                    for (var i = 0; i < protocolMatches.length; i++) {
                        matches.push([protocolMatches[i], '<a href="' + protocolMatches[i].trim() + '"' + targ + '>' +
                        protocolMatches[i].trim() + '</a>']);
                    }
                }

                if (linkMatches[0] != undefined) {
                    for (var i = 0; i < linkMatches.length; i++) {
                        var lnk = linkMatches[i].trim();
                        if (lnk.substring(0, 4) == 'ftp.') {
                            lnk = 'ftp://' + lnk;
                        } else if (lnk.substring(0, 4) == 'www.') {
                            lnk = 'http://' + lnk;
                        } else if (lnk.substring(0, 4) != 'http') {
                            lnk = 'http://' + lnk;
                        }
                        matches.push([linkMatches[i], ' <a href="' + lnk + '"' + targ + '>' + linkMatches[i].trim() + '</a>']);
                    }
                }

                if (mailMatches[0] != undefined) {
                    for (var i = 0; i < mailMatches.length; i++) {
                        matches.push([mailMatches[i], '<a href="mailto:' + mailMatches[i].trim() + '"' + targ + '>' +
                        mailMatches[i].trim() + '</a>']);
                    }
                }

                if (matches[0] != undefined) {
                    for (var i = 0; i < matches.length; i++) {
                        str = str.replace(matches[i][0], matches[i][1]);
                    }
                }

                return str;
            },
            "addSlashes" : function(str, quot) {
                str = str.replace(/\\/g, '\\\\');
                if ((quot != undefined) && (quot.toLowerCase() == 'single')) {
                    str = str.replace(/\'/g, "\\'");
                } else if ((quot != undefined) && (quot.toLowerCase() == 'double')) {
                    str = str.replace(/\"/g, '\\"');
                } else {
                    str = str.replace(/\"/g, '\\"').replace(/\'/g, "\\'");
                }
                return str;
            },
            "stripSlashes" : function(str, quot) {
                str = str.replace(/\\\\/g, '\\');
                if ((quot != undefined) && (quot.toLowerCase() == 'single')) {
                    str = str.replace(/\\'/g, "'");
                } else if ((quot != undefined) && (quot.toLowerCase() == 'double')) {
                    str = str.replace(/\\"/g, '"');
                } else {
                    str = str.replace(/\\'/g, "'").replace(/\\"/g, '"');
                }
                return str;
            },
            "money" : function(num, cur, dec) {
                var decimal = '';

                if (cur == null) {
                    cur = '$';
                }
                if (dec == null) {
                    dec = 2;
                }

                if (num.indexOf('.') != -1) {
                    var numAry = num.split('.');
                    var intgr = parseInt(numAry[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','));
                    if (dec > 0) {
                        decimal = Number('.' + numAry[1]).toFixed(dec);
                    } else {
                        decimal = '';
                    }
                } else {
                    var intgr = parseInt(num.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
                    if (dec > 0) {
                        decimal = '.';
                        for (var i = 0; i < dec; i++) {
                            decimal += '0';
                        }
                    } else {
                        decimal = '';
                    }
                }

                decimal = parseFloat(decimal);

                return cur + new Number(intgr + decimal).toFixed(dec);
            }
        }
    }
})(window);

$(window).on('hashchange', window.app.run);
