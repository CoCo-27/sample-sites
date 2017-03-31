function Timer(updateDisplay, audio) {

  this.timerId;
  this.updateDisplay = updateDisplay;
  this.audio = audio;

  // TODO make this private.
  this.updateTimer = function (endTime) {
    console.log("Timer tick.");
    var hours, minutes, seconds, remainingTime;

    remainingTime = endTime - Date.now();

    if (remainingTime <= 0) {
      this.audio.play();
      remainingTime = 0;
      clearInterval(this.timerId);
      this.timerId = null;
    }
    seconds = remainingTime / 1000 % 60 | 0;
    minutes = remainingTime / (60 * 1000) % 60 | 0;
    hours = remainingTime / (60 * 60 * 1000) % 24 | 0;
    this.updateDisplay(remainingTime);
  //  this.updateDisplay(hours, minutes, seconds);
  }

  this.start = function (duration) {
    console.log("duration " + duration);
    console.log(Number(duration));
    if (this.timerId == undefined) {
      if (Number(duration)) {
        this.timerId = setInterval(this.updateTimer.bind(this), 100, Date.now() + Number(duration));
      } else {
        console.log("Malformed time input.");
      }
    } else {
      console.log("Timer already running.");
    } // otherwise we simply ignore it, since we want each Timer to only deal with one interval.

  }

  this.stop = function(){
    console.log("Stopping timer.");
    clearInterval(this.timerId);
    this.audio.load(); // WARNING: this is an ugly hack since I haven't been
    //able to find a better way to stop and reset the audio file.
    // the reference needs to be null, so that the timer can be restarted.
    this.timerId = null;
  }
}

/*var timer = new Timer("an id");
timer.startTimer(Date.now() + 5210);
var timerTwo = new Timer("timer TWO!!");
timerTwo.startTimer(Date.now() + 11000);

timer.startTimer(Date.now() + 15210); */
