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
         */
        fbq = setInterval(function () {

            var token = recommendations.get('accessToken');
            if (token) {
                FB.api('/me', {
                    fields: 'id,movies,friends{id,name,picture}',
                    access_token: token
                }, function(response) {

                    Messenger().post("Retrieving updated movie likes from Facebook");

                    recommendations.getMovies(response.movies);
                    clearInterval(fbq);
                });
            }

        }, 1000);

        /**
         *
         */



    });
})();