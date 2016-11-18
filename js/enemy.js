var Enemy = function(path) {
  this.path = path;
  this.events = {};

  this.shape = new createjs.Shape();

  this.velocity = 10;
  this.pathIndex = 0;
  this.alive = true;

  this.shape.graphics.beginFill('red').drawCircle(0, 0, 10);
  this.shape.x = path[0][0];
  this.shape.y = path[0][1];
}

Enemy.prototype.tick = function() {
  // Out of turns
  if(this.path.length <= this.pathIndex + 1) {

    // Already dead
    if(this.alive) {
      this.alive = false;

      // Report dead
      if(this.events.destroyed) {
        this.events.destroyed(this);
      }
    }

    return;
  }

  var offset = 5;
  var vel = this.velocity;

  var p = this.path[this.pathIndex + 1];
  var movingX = true;
  var movingY = true;
  
  // Move horizontal
  if(this.shape.x < p[0] - offset) this.shape.x += vel;
  else if(this.shape.x > p[0] + offset) this.shape.x -= vel;
  else movingX = false;

  // Move verticle
  if(this.shape.y < p[1] - offset) this.shape.y += vel;
  else if(this.shape.y > p[1] + offset) this.shape.y -= vel;
  else movingY = false;

  if(!movingX && !movingY) {
    this.pathIndex += 1;
  }
  
}

Enemy.prototype.addEventListener = function(name, callback) {
  this.events[name] = callback;
}