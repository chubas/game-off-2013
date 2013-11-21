Module('Geom')({

    cross : function(vector1, vector2) {
        return ((vector1[1][0] - vector1[0][0]) *
                (vector2[1][1] - vector2[0][1])) -
               ((vector2[1][0] - vector2[0][0]) *
                (vector1[1][1] - vector1[0][1]));
    },

    // Determines if the point P is inside triange ABC
    // Algorithm totally taken from
    // http://www.nerdparadise.com/math/geometry/pointinatriangle/
    isInsideTriangle : function(A, B, C, P) {
        var APxAB = Geom.cross([A, P], [A, B]);
        var BPxBC = Geom.cross([B, P], [B, C]);
        var CPxCA = Geom.cross([C, P], [C, A]);

        // Check if AP X AB, BP X BC, CP X CA all have same sign
        return (APxAB < 0 && BPxBC < 0 && CPxCA < 0) ||
                (APxAB > 0 && BPxBC > 0 && CPxCA > 0);

    }

});