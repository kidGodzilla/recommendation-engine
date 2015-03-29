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

    // JS Dependencies
    loadScript("//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js");
    loadScript("//cdn.firebase.com/js/client/2.2.1/firebase.js");
    loadScript("//cdn.jsdelivr.net/lodash/3.5.0/lodash.compat.min.js");

    // Main JS
    loadScript("fb.js");
    loadScript("core.js");
    loadScript("init.js");
    loadScript("utils.js");

    // Recommendation Engine
    loadScript("auth.js");
    loadScript("likeMovie.js");


})();