({
    enemies : (function() {
        var totalEntities = [];

        /******** SNAAAKESS!!! **********/
        var blockWidth = 20,
            blockSpacing = 10,
            swingerHeight = 50,
            segments = 17,
            snakeSpacing = 150;

        var createSnake = function(coord) {
            var snakeBlocks = [];
            var color1 = Math.floor(Math.random() * Game.FACTIONS.length);
            var color2 = (color1 + 1) % Game.FACTIONS.length;

            var startX = coord[0],
                middleY = coord[1];

            var x, y, initialPosition;
            for(var i = 0; i < segments; i++) {
                x = startX + (i * (blockWidth + blockSpacing));
                y = middleY;
                // Trust me on this one\
                // http://www.wolframalpha.com/input/?i=y%28x%29+%3D+%7C%28x%2F4+mod+2%29+-+1%7C
                // y(x) = |(x/4 mod 2) - 1|
                initialPosition = Math.abs(((i / 4) % 2) - 1);

                snakeBlocks.push([
                    'SWI', 2, swingerHeight, 90, initialPosition,
                    [
                        'REC',
                        x,
                        middleY,
                        blockWidth,
                        swingerHeight * 2,
                        1,
                        (i - 2) % 4 === 0 ? color1 : color2
                    ]

                ]);
            }
            return snakeBlocks;
        };
        var x = 800;
        var nextX = x + (segments * (blockWidth + blockSpacing) + snakeSpacing);
        var middleHeight = swingerHeight / 2;
        var snakesCoords = [
            [x, 100 - middleHeight],
            [x, 400 - middleHeight],
            [nextX, 250 - middleHeight],
            [nextX, 0 - middleHeight],
            [nextX, 500 - middleHeight]
        ];
        snakesCoords.forEach(function(pair) {
            totalEntities = totalEntities.concat(createSnake(pair));
        });
        /*******/
        return totalEntities;

    })()
})