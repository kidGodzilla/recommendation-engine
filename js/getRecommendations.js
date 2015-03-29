"use strict";

(function () {
    recommendations.registerGlobal('getRecommendations', function () {
        var uid = recommendations.get('uid');
        var firebaseRef = new Firebase("https://movierecommendations.firebaseio.com/affinity/" + uid);

        firebaseRef.on("value", function(snapshot) { //.orderByChild("count").limitToLast(5)
            var val = snapshot.val();

            for (var key in val) {
                var guy = val[key];

                if (guy && guy.movies) {
                    for (var i = 0; i < guy.movies.length; i++)
                        recommendations.recommendations.push(guy.movies[i]);
                }
            }


        });

    })
})();