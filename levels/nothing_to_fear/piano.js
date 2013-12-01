({
    enemies : (function() {
        var totalEntities = [];

        // Start making these variable, they will change

        var game_w = 1000;
        var game_h = 500;

        var beat = 235; // Distance equals to a beat in the song

        var startX = 1400;
        var motiff = function(initialX, reverse) {
            var construct = [];
            var radius = 40
            var angles = reverse ? [180, 135, 90] : [180, 225, 270];
            var y = reverse ? 20 : game_h - 20;
            angles.forEach(function(angle, index) {
                if(index === 3) {
                    totalEntities.push(
                        ["PRO", 2 - 0.8 * (2 - index), angle,
                            ["TRI", initialX + 80, y, radius, 0, 1.2, 0]]

                    );
                } else {
                    totalEntities.push(
                        ["PRO", 2 + 0.7 * (2 - index), angle,
                            ["TRI", initialX, y, radius, 0, 1.2, 0]]

                    );
                }
            });
            return construct;
        };

        

        // /******** Intro, and main motiff along the game **********/
        // var motiff = function(initialX, reverse) {
        //     var speed = motiffSpeed;
        //     var wave = [];
        //     var width = 40;
        //     var padding = 10;
        //     for(var i = 0; i < 8; i++) {
        //         var index = reverse ? 3 - i : i;
        //         wave.push([
        //             "ROT", 4, [
        //                 "TRI",
        //                 initialX + (i * 30),
        //                 250,
        //                 // ((game_h / 4) * index) + (game_h / 8),
        //                 30,
        //                 speed,
        //                 1
        //             ]
        //         ]);
        //     }
        //     return wave;
        // };
        // /*******/

        for(i = 0; i < 4; i++) {
            totalEntities = totalEntities.concat(
                motiff(
                    startX + (4 * i * beat),
                    i % 2 === 0
                )
            );
        }
        return totalEntities;

    })()
})