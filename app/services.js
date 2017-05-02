/**
 * services.js
 */

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