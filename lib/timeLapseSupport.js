Module('TimeLapseSupport')({

    // Next is add timelapse percentage dependent events, and pass them as
    // actual events with EventSupport

    prototype : {

        // No override for the init _timerFunctions. Fix by requiring this
        // function to be called first, at setup
        prepareTimers : function() {
            this._timerFunctions = {};
        },

        // Possible options:
        //   time : integer. Number of ticks
        //   onTick : function() // Run each tick. Args, currentTick, totalTicks
        addTimer : function(name, timerOptions) {
            this._timerFunctions[name] = timerOptions;
            if(!timerOptions.onTick) {
                timerOptions.onTick = function() {}; // void
            }
            timerOptions._ticks = timerOptions.duration;
        },

        // This method is horrible, the API just doesn't look any nice.
        // Refactor
        addCooldownableAction : function(name, actionOptions, cooldownTime, cooldownTick) {
            var manager = this;
            if(!manager.isRunning(name)) {
                var originalOnTick = actionOptions.onTick;
                actionOptions.onTick = function(currentTick, totalTicks) {
                    if(!game.isRunning(name + '__cooldown')) {
                        originalOnTick.call(manager, currentTick, totalTicks);
                        if(currentTick === 0) {
                            console.log("Event " + name + " ended");
                            console.log("Event " + name + "__cooldown started");
                            manager.addTimer(name + '__cooldown', {
                                duration : cooldownTime,
                                onTick : function(currentCooldownTick, totalCooldownTicks) {
                                    if(cooldownTick) {
                                        cooldownTick.call(manager, currentCooldownTick, totalCooldownTicks);
                                    }
                                    if(currentCooldownTick === 0) {
                                        console.log("Event " + name + "__cooldown ended");
                                    }
                                }
                            });
                        }
                    }
                };
                this.addTimer(name, actionOptions);
                console.log("Event " + name + " started");
            }
        },

        isRunning : function(name) {
            return !!this._timerFunctions[name];
        },

        // Should run once per tick cycle.
        manageTemporalActions : function() {
            var manager = this;
            Object.keys(this._timerFunctions).forEach(function(name) {
                manager._timerFunctions[name]._ticks -= 1;

                manager._timerFunctions[name].onTick(
                    manager._timerFunctions[name]._ticks,
                    manager._timerFunctions[name].duration
                );
                if(manager._timerFunctions[name]._ticks === 0) {
                    delete manager._timerFunctions[name];
                }
            });
        },

    }
});