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
            // recommendations.recommendations = recommendations.shuffle(recommendations.recommendations);

            /**
             * Display our recommendations
             */
            var body = "";
            var movies = recommendations.recommendations;

            for (var i = 0; i < movies.length && i < 10; i++) {
                var movie = movies[i];

                if(recommendations.movies[movie]) {

                    var movieData = recommendations.movies[movie];

                    var inc = i + 1;
                    var ol = "<div class='hidden-xs hidden-sm col-md-1 text-right'><h3>" + inc + ".</h3></div>";

                    console.log(movieData);

                    var pic;

                    if (movieData.photos) {
                        var pics = movieData.photos[0].images;
                        pic = pics.slice(-1)[0].source;
                    } else {
                        pic = "placeholder.png";
                    }

                    var photo = "<div class='col-xs-12 col-sm-6 col-md-3 text-center' style='background: #fff;border-top: 10px solid #fafafa;border-bottom:10px solid #fafafa'><img src='" + pic + "' style='height: 114px;border: 5px solid #fff;margin: 0 auto; max-width: 140px'></div>";
                    var name = movieData.name ? "<h3>" + movieData.name +"</h3>" : "";
                    var about = movieData.about ? "<p>" + movieData.about + "</p>" : "";
                    var plot = movieData.plot ? "<p>" + movieData.plot + "</p>" : "";

                    var item = ol + photo + "<div class='col-xs-12 col-sm-6 col-md-8'>" + name + about + plot + "</div>";

                    body += "<div class='row'>" + item + "</div>";

                } else {

                    ref.child("movies/" + movie).on("value", function(snapshot) {
                        recommendations.movies[movie] = snapshot.val();
                    });
                }
            }

            if (body === "") {
                body = "<h1 class=\"text-center\">Computing...</h1>";
            } else {
                body = "<h1>Your Recommendations</h1>" + body + "";
                $('.marketing').hide();
            }

            $('#body').html(body);

        }, 5000);

    });
})();