"use strict";

(function () {
    recommendations.registerGlobal('computeAffinity', function (user, movies) {
        var uid = recommendations.get('uid');
        var myMovies = recommendations.myMovies;

        var intersection = recommendations.intersection(myMovies, movies);
        var count = intersection.length;

        var firebaseRef = new Firebase("https://movierecommendations.firebaseio.com");

        if (uid && user) {
            firebaseRef.child('affinity/' + uid + '/' + user).update({
                count: count,
                movies: movies
            });

            // The inverse is also true
            firebaseRef.child('affinity/' + user + '/' + uid).update({
                count: count,
                movies: myMovies
            });
        }

    });
})();