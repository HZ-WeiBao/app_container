

var Timer = function (callback, delay) {
  this.timer = setTimeout(callback, delay);
  this.trigger = callback;

  this.clear = function () {
    if (this.timer)
      clearTimeout(this.timer);
  };
}

exports.Timer = Timer;

// var t = new Timer(function () { }, 300);


