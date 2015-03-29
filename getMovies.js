(function () {
    recommendations.registerGlobal('myMovies', []);
    recommendations.registerGlobal('movies', {});

    recommendations.registerGlobal('getMovies', function (obj) {
        if (!obj) return false;

        var firebaseRef = new Firebase("https://movierecommendations.firebaseio.com");

        if (obj && obj.data) {
            for (var i = 0; i < obj.data.length; i++) {
                var movie = obj.data[i];

                // Insert movie title into local cache
                recommendations.movies[movie.id] = {};
                recommendations.movies[movie.id].name = movie.name;

                // Insert movie title into master movie object in firebase
                firebaseRef.child('movies/' + movie.id).update({
                    name: movie.name
                });

                // Append movie to my movies
                if (recommendations.myMovies.indexOf(movie.id) === -1)
                    recommendations.myMovies.push(movie.id);

            }

            // Append movie to list of movies this user likes
            var uid = recommendations.get('uid');
            var myMovies = recommendations.myMovies;
            if (uid) {
                firebaseRef.child('users/' + uid).update({
                    movies: myMovies
                });
            }

        }

        if (obj && obj.paging && obj.paging.next) {
            var url = obj.paging.next;
            $.ajax({
                dataType: "json",
                url: url,
                success: function (data) {
                    if (data) recommendations.getMovies(data);
                }
            });
        }

    });
})();