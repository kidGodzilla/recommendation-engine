"use strict";

(function () {
    recommendations.registerGlobal('authWithFacebook', function () {

        var ref = new Firebase("https://movierecommendations.firebaseio.com");
        recommendations.set('firebaseRef', ref);

        ref.authWithOAuthPopup("facebook", function(error, authData) {
            if (error) {
                Messenger().post({
                    message: "Login Failed. " + error,
                    type: 'error',
                    showCloseButton: true
                });
                console.log("Login Failed!", error);
            } else {

                Messenger().post("Logged in successfully");

                // Cache the facebook access token
                if (authData && authData.facebook && authData.facebook.accessToken)
                    recommendations.set('accessToken', authData.facebook.accessToken);

                // Cache the firebase user ID
                if (authData && authData.uid)
                    recommendations.set('uid', authData.uid);

                // Cache the user's email
                if (authData && authData.facebook && authData.facebook.email)
                    recommendations.set('email', authData.facebook.email);

                // Cache the user's facebook profile
                if (authData && authData.facebook && authData.facebook.cachedUserProfile) {
                    recommendations.set('cachedUserProfile', authData.facebook.cachedUserProfile);
                    ref.child('users/' + authData.uid).update(authData.facebook.cachedUserProfile);
                }

            }
        }, {
            scope: "email,user_likes,user_friends"
        });

    });
})();