Module('Util')({
    getUrlParams : function () {
        var qs = document.location.search.split("+").join(" ");

        var params = {}, tokens,
            re = /[?&]?([^=]+)=([^&]*)/g;

        while (tokens = re.exec(qs)) {
            params[decodeURIComponent(tokens[1])] =
                decodeURIComponent(tokens[2]);
        }

        return params;

    },

    // Example usage:
    //    var simpleCallback = function(x, callback) {
    //        var y = x * 2;
    //        callback(y);
    //    };
    //
    //    var otherCallback = function(x, callback) {
    //        var y = x + 1;
    //        callback(y);
    //    };
    //
    //    Util.cookArray([
    //        [simpleCallback, null, 10],
    //        [simpleCallback, null, 5],
    //        [simpleCallback, null, 30],
    //        [simpleCallback, null, 4]
    //    ], function(arrayOfResults) {
    //        console.log("Cook array finished");
    //        console.log(arrayOfResults);
    //    });
    //
    //    Util.cookObject({
    //        first  : [simpleCallback, null, 100],
    //        second : [otherCallback, null, 10]
    //    }, function(objectOfResults) {
    //        console.log("Cook object finished");
    //        console.log(objectOfResults);
    //    });
    cookArray : function(arrayOfFunctionsWithCallbacks, callback) {
        var length = arrayOfFunctionsWithCallbacks.length;
        var fulfilled = [];
        var count = 0;

        if(length === 0) {
            callback([]);
        } else {
            for(var i = 0; i < length; i++) {
                var fnArgs = arrayOfFunctionsWithCallbacks[i].slice(0);
                var fn = fnArgs.shift();
                var bindingObj = fnArgs.shift();

                (function(i) {
                    fnArgs.push(function(){
                        if(arguments.length === 1) {
                            fulfilled[i] = arguments[0];
                        } else {
                            fulfilled[i] = Array.prototype.slice.call(arguments);
                        }
                        count++;
                        if(count === length) {
                            callback(fulfilled);
                        }
                    });
                })(i);

                fn.apply(bindingObj || this, fnArgs);
            }
        }
    },
 

});