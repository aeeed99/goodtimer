var Timer = require("t-minus")

var countdown = new Timer("03"
  , function(){ console.log("time is up!")}
  , function(){
    if(this.secs % 10 === 0 && this.getTotal() < 60 && this.secs)
      console.warn("ONLY " + this.secs + " SECONDS REMAINING");
    else console.log(this.getTimerUI());
  });