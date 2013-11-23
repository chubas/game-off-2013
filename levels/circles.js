({
    enemies : (function() {
        var outer = [];
        var inner = [];
        for(var i = 0; i < 360; i+= 30) {
            outer.push(
                ["ROT", -1,
                    ["EXT", 300, i,
                        ["CIR", 900, 250, 30, 1, 0]]]
            );
            inner.push(
                ["ROT", 1,
                    ["EXT", 100, i,
                        ["CIR", 900, 250, 20, 1, 1]]]
            );
        }
        return outer.concat(inner);
    })()
});