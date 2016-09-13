function Timer(id) {

  this.timerId;
  this.id = id;

  this.updateTimer = function (endTime) {
    var hours, minutes, seconds, remainingTime;

    remainingTime = endTime - Date.now();

    if (remainingTime <= 0) {
      //   alert("Time's up");
      console.log("Time's up");
      remainingTime = 0;
      clearInterval(this.timerId);
    }
    seconds = remainingTime / 1000 % 60 | 0;
    minutes = remainingTime / (60 * 1000) % 60 | 0;
    hours = remainingTime / (60 * 60 * 1000) % 24 | 0;
    this.updateDisplay(hours, minutes, seconds);
  }

  this.updateDisplay = function (hours, minutes, seconds) {
    var timerEl = $(".timer#" + id);
    timerEl.find(".seconds").text(seconds);
    console.log(timerEl.find(".seconds"));
    console.log(timerEl);
    console.log(`id ${this.id} hours ${hours} minutes ${minutes} seconds ${seconds}`)
  }

  this.startTimer = function (duration) {
    console.log("duration " + duration);
    console.log(Number(duration));
    if (this.timerId == undefined) {
      if(Number(duration)){
        this.timerId = setInterval(this.updateTimer.bind(this), 1000, Date.now() + Number(duration));
      } else {
        console.log("Malformed time input.");
      }
    } else {
      console.log("Timer already running.");
    } // otherwise we simply ignore it, since we want each Timer to only deal with one interval.
  }
}

/*var timer = new Timer("an id");
timer.startTimer(Date.now() + 5210);
var timerTwo = new Timer("timer TWO!!");
timerTwo.startTimer(Date.now() + 11000);

timer.startTimer(Date.now() + 15210); */
