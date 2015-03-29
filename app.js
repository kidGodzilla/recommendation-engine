"use strict";

(function () {
    var fbq;

    $(document).ready(function () {
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
            // recommendations.recommendations = recommendations.shuffle(recommendations.recommendations); // For testing styles

            /**
             * Display our recommendations
             */
            var body = "";
            var movies = recommendations.recommendations;

            // Limits to the first 14 or fewer recommendations
            for (var i = 0; i < movies.length && i < 14; i++) {
                var movie = movies[i];

                if(recommendations.movies[movie]) {

                    var movieData = recommendations.movies[movie];

                    /**
                     * Builds the item
                     */
                    var inc = i + 1;
                    var ol = "<div class='hidden-xs hidden-sm col-md-1 text-right'><h1>" + inc + ".</h1></div>";

                    var pic;

                    if (movieData.photos) {
                        var pics = movieData.photos[0].images;
                        pic = pics.slice(-1)[0].source;
                    } else {
                        pic = "placeholder.png";
                    }

                    var photo = "<div class='col-xs-12 col-sm-6 col-md-2 text-center image-section'><img src='" + pic + "'></div>";
                    var name = movieData.name ? "<h3>" + movieData.name +"</h3>" : "";
                    var about = movieData.about ? "<p>" + movieData.about + "</p>" : "";
                    var plot = movieData.plot ? "<p>" + movieData.plot + "</p>" : "";

                    var afterThought = "<div class='hidden-xs hidden-sm col-md-1'>&nbsp;</div>";

                    var item = ol + photo + "<div class='col-xs-12 col-sm-6 col-md-8'>" + name + about + plot + "</div>" + afterThought;

                    var altBg = "";
                    if (inc%2) altBg = " alt-bg";

                    body += "<div class='row b-top" + altBg+ "'><div><div class='row'>" + item + "</div></div></div>";

                } else {

                    /**
                     * Sometimes we don't have a specific movie in our local cache. Instead of
                     * delaying the render we wait until next render to check if the promise has resolved
                     */
                    ref.child("movies/" + movie).on("value", function(snapshot) {
                        recommendations.movies[movie] = snapshot.val();
                    });
                }
            }

            /**
             * Toggles between loading state and rendered state
             */
            if (body === "") {
                body = "<h1 class=\"text-center\">Computing...</h1>";
            } else {
                body = "<h1 class='title'>Your Recommendations</h1>" + body + "";
                $('.marketing').hide();
            }

            $('#body').html(body);
        }, 2500);

    });
})();