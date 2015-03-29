(function () {
    var fbq;

    $(document).ready(function () {
        /**
         * Authenticate the firebase with facebook
         */
        recommendations.authWithFacebook();


        /**
         * Poll (250ms interval) until we have a facebook access token,
         * Then get a list of movies our user has liked on facebook
         * (Added debouncing because callback time can exceed 1s)
         */
        var debouncing = false;

        fbq = setInterval(function () {

            var token = recommendations.get('accessToken');
            if (token) {
                FB.api('/me', {
                    fields: 'id,movies{about,plot_outline,photos,name},friends{id,name,picture}',
                    access_token: token
                }, function(response) {

                    if (!debouncing) {
                        debouncing = true;

                        Messenger().post("Retrieving updated movie likes from Facebook...");

                        recommendations.getMovies(response.movies);

                        Messenger().post("Success!");

                        clearInterval(fbq);
                    }

                });
            }

        }, 250);

        /**
         * Start computing user affinity
         */
        var ref = new Firebase("https://movierecommendations.firebaseio.com");

        ref.child("users").on("value", function(snapshot) {
            var user = snapshot.val();
            for (var key in user) {
                recommendations.computeAffinity(key, user[key].movies);
            }
        });

        recommendations.registerGlobal('recommendations', []);

        // We need to update our values periodically, as this array will grow over time
        setInterval(function () {

            /**
             * Get recommendations
             */
            recommendations.getRecommendations();

            recommendations.recommendations = recommendations.uniq(recommendations.recommendations);
            // recommendations.recommendations = recommendations.shuffle(recommendations.recommendations);

            /**
             * Display our recommendations
             */
            var body = "<ol>";
            var movies = recommendations.recommendations;

            for (var i = 0; i < movies.length && i < 10; i++) {
                var movie = movies[i];

                if(recommendations.movies[movie]) {
                    var movieData = recommendations.movies[movie];

                    var template = "<li><h3>" + movieData.name +"</h3></li>";
                    body += template;
                } else {
                    ref.child("movies/" + movie).on("value", function(snapshot) {
                        recommendations.movies[movie] = snapshot.val();;
                    });
                }
            }

            body += "</ol>";

            $('body').html(body);

        }, 5000);

    });
})();