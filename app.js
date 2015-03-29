(function () {
    var fbq;

    $(document).ready(function () {
        /**
         * Authenticate the firebase with facebook
         */
        recommendations.authWithFacebook();


        /**
         * Poll (1s interval) until we have a facebook access token,
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

        }, 1000);

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


    });
})();