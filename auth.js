(function () {
    recommendations.registerGlobal('authWithFacebook', function () {

        var ref = new Firebase("https://movierecommendations.firebaseio.com");
        recommendations.set('firebaseRef', ref);

        ref.authWithOAuthPopup("facebook", function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                console.log("Authenticated successfully with payload:", authData);
                if (authData && authData.facebook && authData.facebook.accessToken)
                    recommendations.set('accessToken', authData.facebook.accessToken);
            }
        }, {
            scope: "email,user_likes,user_friends"
        });

    });
})();