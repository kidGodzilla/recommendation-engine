"use strict";

(function() {
    function loadScriptAsync(resource) {
        var sNew = document.createElement("script");
        sNew.async = true;
        sNew.src = resource;
        var s0 = document.getElementsByTagName('script')[0];
        s0.parentNode.insertBefore(sNew, s0);
    }

    function loadScript(resource) {
        document.write('<script src="' + resource + '"></script>');
    }

    function loadStylesheet(resource) {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = resource;
        link.media = 'all';
        head.appendChild(link);
    }

    // Stylesheets
    loadStylesheet("vendor/vex.css");
    loadStylesheet("vendor/vex-theme-default.css");
    loadStylesheet("//cdnjs.cloudflare.com/ajax/libs/messenger/1.4.0/css/messenger.css");
    loadStylesheet("//cdnjs.cloudflare.com/ajax/libs/messenger/1.4.0/css/messenger-theme-air.css");
    loadStylesheet("//cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.4/yeti/bootstrap.min.css");

    // JS Dependencies
    loadScript("//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js");
    loadScript("//cdn.firebase.com/js/client/2.2.3/firebase.js");
    loadScript("//cdn.jsdelivr.net/lodash/3.5.0/lodash.compat.min.js");
    loadScript("vendor/vex.combined.min.js");
    loadScript("//cdnjs.cloudflare.com/ajax/libs/messenger/1.4.0/js/messenger.min.js");

    document.write("<script>vex.defaultOptions.className = 'vex-theme-default'; Messenger.options = { extraClasses: 'messenger-fixed messenger-on-top messenger-on-right', theme: 'air'};</script>");

    // Main JS
    loadScript("js/fb.js");
    loadScript("js/core.js");
    loadScript("js/init.js");
    loadScript("js/utils.js");

    // Recommendation Engine
    loadScript("js/auth.js");
    loadScript("js/getMovies.js");
    loadScript("js/computeAffinity.js");
    loadScript("js/getRecommendations.js");
    // loadScript("js/renderRecommendations.js");

    // Run App
    loadScript("js/app.js");

})();