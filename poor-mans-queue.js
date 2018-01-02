class PoorMansQueue {

  constructor() {
    this._queue = [];
    this.eventHandler = function() {};
  }

  push(item, i){    
    this._queue.push(item)    
    setTimeout(this.eventHandler, 3000+ i);
  }

  shift(){
   return this._queue.shift();
  }

  setEventHandler(handler){
    this.eventHandler = handler;
  }
}

module.exports = new PoorMansQueue();