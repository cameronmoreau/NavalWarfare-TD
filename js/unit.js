var Unit = function(x, y) {
  this.shape = new createjs.Shape();
  this.shape.graphics.beginFill('green').drawCircle(0, 0, 5);
  this.shape.x = x;
  this.shape.y = y;
}