({
    enemies : (function() {
        var totalEntities = [];

        // Start making these variable, they will change
        var game_w = 1000;
        var game_h = 500;

        var beat = 100; // Distance equals to a beat in the song

        var motiffSpeed = 2;

        /******** Intro, and main motiff along the game **********/
        var motiff = function(initialX, reverse) {
            var speed = motiffSpeed;
            var wave = [];
            var width = 40;
            var padding = 10;
            for(var i = 0; i < 4; i++) {
                var index = reverse ? 3 - i : i;
                wave.push([
                    "REC",
                    initialX + (i * (beat * speed)),
                    ((game_h / 4) * index) + (game_h / 8),
                    width,
                    (game_h / 4) - (2 * padding),
                    speed,
                    i
                ]);
            }
            return wave;
        };
        /*******/

        var startX = 970;
        var i;
        for(i = 0; i < 4; i++) {
            totalEntities = totalEntities.concat(
                motiff(startX + (4 * i * beat * motiffSpeed), i >= 2)
            );
        }
        return totalEntities;

    })()
})