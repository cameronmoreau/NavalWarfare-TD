var Gui = function(types, info, itemClicked) {
  this.itemClicked = itemClicked;
  this.info = info;
  this.container = new createjs.Container();
  this.container.x = 960;

  var _container = this.container;

  this.bg = new createjs.Shape();
  this.bg.graphics.beginFill('#E4E4E5').drawRect(0,0,256,640);
  this.bg.alpha = 0.6;

  this.container.addChild(this.bg);
  
  // Create Buttons
  types.forEach(function(item, i) {
    var container = new createjs.Container();
    container.addEventListener('click', itemClicked.bind(null, info));

    var bg = new createjs.Shape();
    bg.graphics.beginFill('orange').drawRect(0,0,200,50);
    bg.y = i * 60;
    bg.x = 28;

    var text = new createjs.Text(item, "16px Prociono", "#ffffff");
    text.x = 48;
    text.y = (i * 60) + 16;
    
    container.addChild(bg);
    container.addChild(text);
    
    _container.addChild(container);
  });
}