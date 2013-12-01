({
    enemies : (function() {
        var totalEntities = [];

        // Start making these variable, they will change
        var game_w = 1000;
        var game_h = 500;

        var beat = 610; // Distance equals to a beat in the song

        /******** Intro, and main motiff along the game **********/
        var motiff = function(initialX, reverse) {
            var wave = [];
            var height = 20;
            for(var i = 0; i < 8; i++) {
                wave.push([
                    "SWI", 3, height, 90, i / 8, [
                        "ROT", 1, [
                            "TRI",
                            initialX + (i * 25),
                            250 - height / 2, // half radius
                            // ((game_h / 4) * index) + (game_h / 8),
                            35,
                            5 * i,
                            6,
                            2
                        ]
                    ]
                ]);
            }
            return wave;
        };
        /*******/

        var startX = 3600;
        for(i = 0; i < 8; i++) {
            totalEntities = totalEntities.concat(
                motiff(startX + (4 * i * beat))
            );
        }
        return totalEntities;

    })()
})