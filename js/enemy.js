var Enemy = function(path, info) {
  this.id = createjs.UID.get();
  this.path = path;
  this.health = 100;
  this.events = {};
  this.x = path[0][0];
  this.y = path[0][1];

  this.shape = new createjs.Shape();

  this.velocity = 10;
  this.pathIndex = 0;
  this.alive = true;

  this.shape.graphics.beginFill('red').drawCircle(0, 0, 10);
  this.shape.x = this.x;
  this.shape.y = this.y;
}

Enemy.prototype.tick = function() {
  // Out of turns
  if(this.path.length <= this.pathIndex + 1) {

    // Already dead
    if(this.alive) {
      this.alive = false;
      this.events.finished(this);
    }

    return;
  }

  var offset = 5;
  var vel = this.velocity;

  var p = this.path[this.pathIndex + 1];
  var movingX = true;
  var movingY = true;
  
  // Move horizontal
  if(this.x < p[0] - offset) this.x += vel;
  else if(this.x > p[0] + offset) this.x -= vel;
  else movingX = false;

  // Move verticle
  if(this.y < p[1] - offset) this.y += vel;
  else if(this.y > p[1] + offset) this.y -= vel;
  else movingY = false;

  if(!movingX && !movingY) {
    this.pathIndex += 1;
  }
  
  this.shape.x = this.x;
  this.shape.y = this.y;
}

Enemy.prototype.damage = function(damage) {
  if(!this.alive) return;

  this.health -= damage;
  if(this.health <= 0) {
    this.alive = false;
    this.events.destroyed(this);
  }
}

Enemy.prototype.addEventListener = function(name, callback) {
  this.events[name] = callback;
}