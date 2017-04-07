// TODO is there any need to store the times in
// this object?  Isn't it sufficient to have them
// on the DOM?  Performance?

// TODO It's probably clearer to have three functions setWork, setNotes and setBreak
// rather than this awkward switch.  What does it get us?
var pomodoro = (function ($) {
  var module = {};
  function Pomodoro(work, notes, breakTime, element) {
      this.notes = notes;
      this.work = work;
      this.breakTime = breakTime;
      this.workTimer = null;
      this.notesTimer = null;
      this.breakTimer = null;

      var multiplier = 11;

      this.startWorking = function startWorking(){
        // convert minutes to seconds and then start the timer
        workTimer.start(work * 60);
        if(notes > 0){
          notesTimer.start((notes + work) * 60);
        }
      };

      this.startBreak = function startBreak() {
        // convert minutes to seconds and then start the timer
        breakTimer.start(breakTime * 60);
      };

      this.stop = function stop() {
        workTimer.stop();
        notesTimer.stop();
        breakTimer.stop();
      };

      this.setTime = function setTime(time, type) {
        switch (type) {
          case 0:
            this.work = time;
            element.children('.first-timer').width(multiplier*this.work);
            break;
          case 1:
            this.notes = time;
            element.children('.second-timer').width(multiplier*this.notes);
            break;
          case 2:
            this.breakTime = time;
            element.children('.break-timer').width(multiplier*this.breakTime);
            break;
          default:

        }
      };
      this.updateTimes = function updateTimes(work, notes, breakTime) {
        this.setTime(work, 0);
        this.setTime(notes, 1);
        this.setTime(breakTime, 2);
      };

      // Initial update.
      this.updateTimes(work, notes, breakTime);
  }

  Pomodoro.prototype.setWorkTimer = function (updateDisplay, audio) {
    this.workTimer = new Timer(updateDisplay, audio);
  };

  Pomodoro.prototype.setNotesTimer = function (updateDisplay, audio) {
    this.notesTimer = new Timer(updateDisplay, audio);
  };

  Pomodoro.prototype.setBreakTimer = function (updateDisplay, audio) {
    this.breakTimer = new Timer(updateDisplay, audio);
  };

  module.create = function createPomodoro(work, notes, breakTime, element) {
    return new Pomodoro(work, notes, breakTime, element);
  };

  return module;
}(jQuery));
