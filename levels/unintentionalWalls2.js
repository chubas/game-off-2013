({
    enemies : (function() {
        var totalEntities = [];
        var createSnake = function(coord) {
            var snakeBlocks = [];
            var blockWidth = 10,
                blockSpacing = 5,
                swingerHeight = 150,
                segments = 17;

            var startX = coord[0],
                middleY = coord[1];

            var x, y, initialPosition;
            for(var i = 0; i < segments; i++) {
                x = startX + (segments * (blockWidth + blockSpacing));
                y = middleY;
                initialPosition = Math.abs(((i / 2) % 4) - 2) - 1;

                console.log("X, y:", x, y, 'this');
                snakeBlocks.push([
                    'SWI', 4, swingerHeight, 0, initialPosition,
                    [
                        'REC',
                        x,
                        y,
                        blockWidth,
                        swingerHeight / 2,
                        1,
                        0
                    ]

                ]);
            }
            return snakeBlocks;
        };
        var x = 800;
        var snakesCoords = [
            [x, 100], [x, 400], [x + 400, 250]
        ];
        snakesCoords.forEach(function(pair) {
            totalEntities = totalEntities.concat(createSnake(pair));
        });
        return totalEntities;
    })()
})