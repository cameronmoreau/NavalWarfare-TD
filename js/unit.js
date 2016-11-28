var Unit = function(x, y, type) {
  this.x = x;
  this.y = y;
  this.type = type;
  
  this.shape = new createjs.Shape();
  this.shape.graphics.beginFill(type.color).drawCircle(0, 0, 10);
  this.shape.x = x;
  this.shape.y = y;

  this.timer = 0;
}

Unit.prototype.tick = function(enemies) {
  this.timer += 1;

  if(this.timer > this.type.rate) {
    this.timer = 0;
    this.attack(enemies);
  }
}

Unit.prototype.attack = function(enemies) {
  console.log('tried attack');
  var offset = this.type.range;

  var minX = this.x - offset;
  var maxX = this.x + offset;
  var minY = this.y - offset;
  var maxY = this.y + offset;

  //console.log(minX, maxX, minY, maxY);
  
  // Find target
  for(var i = 0; i < enemies.length; i++) {
    var enemy = enemies[i];

    //console.log(enemy.x, enemy.y);
    if(enemy.x < maxX && enemy.x > minX && enemy.y > minY && enemy.y < maxY) {
      console.log('found one');
      enemy.damage(this.type.damage);
      break;
    }
  }
}