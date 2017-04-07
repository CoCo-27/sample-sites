function Timer(updateDisplay, audio) {

    this.timerId = null;
    this.updateDisplay = updateDisplay;
    this.audio = audio;
    this.duration = null;
    this.paused = false;

    // update every tenth of a second.
    var delta = 100;

    // TODO make this private.
    this.updateTimer = function(endTime) {
        var hours, minutes, seconds, remainingTime;

        this.duration = endTime - Date.now();

        if (this.duration <= 0) {
            this.audio.play();
            this.duration = 0;
            clearInterval(this.timerId);
            this.timerId = null;
        }
        this.updateDisplay(this.duration);
    };

    this.prepare = function prepare(duration) {
        if (!Number(duration)) throw new Error("Malformed time input.  Please enter a number");
        this.duration = duration; // If the timer has a non-zero duration it is
        // ready to go.
    }

    this.start = function() {
        if (this.duration > 0) { // The timer is in the ready state and can be
            // toggled between paused and running
            if (this.timerId === null) {  // The timer is not running and should
              // be started
                if (!Number(this.duration)) throw new Error("Malformed time input.  Please enter a number");
                this.timerId = setInterval(this.updateTimer.bind(this), delta, Date.now() + Number(this.duration));
            }  // It is already running.
        } // If it's not ready then nothing happens.
    };


    this.stop = function() {
        clearInterval(this.timerId);  // If no timer is running, this does nothing.
        this.audio.load(); // WARNING: this is an ugly hack since I haven't been
        //able to find a better way to stop and reset the audio file.
        // the reference needs to be null, so that the timer can be restarted.
        this.timerId = null;
    };
}

/*var timer = new Timer("an id");
timer.startTimer(Date.now() + 5210);
var timerTwo = new Timer("timer TWO!!");
timerTwo.startTimer(Date.now() + 11000);

timer.startTimer(Date.now() + 15210); */
