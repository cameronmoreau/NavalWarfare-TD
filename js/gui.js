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


  // HUD
  this.healthText = new createjs.Text(
    'Health: ', 
    '22px Prociono', 
    '#ffffff'
  );

  this.moneyText = new createjs.Text(
    'Money: ', 
    '22px Prociono', 
    '#ffffff'
  );

  this.timeText = new createjs.Text(
    'Time: 8:00', 
    '22px Prociono', 
    '#ffffff'
  );

  this.timeText.x = 10;
  this.healthText.x = 10;
  this.moneyText.x = 10;

  this.timeText.y = 10;
  this.healthText.y = 40;
  this.moneyText.y = 70;

  this.container.addChild(this.timeText);
  this.container.addChild(this.healthText);
  this.container.addChild(this.moneyText);
  
  // Create Buttons
  var top = 120;
  types.forEach(function(item, i) {
    var container = new createjs.Container();
    container.addEventListener('click', itemClicked.bind(null, info));

    var bg = new createjs.Shape();
    bg.graphics.beginFill('orange').drawRect(0,0,200,50);
    bg.y = i * 60 + top;
    bg.x = 28;

    var text = new createjs.Text(
      item.name + ' (£' + item.price + ')', 
      '16px Prociono', 
      '#ffffff'
    );
    text.x = 48;
    text.y = (i * 60) + 16 + top;
    
    container.addChild(bg);
    container.addChild(text);
    
    _container.addChild(container);
  });
}

Gui.prototype.setMoney = function(amount) {
  this.moneyText.text = 'Money: £' + amount;
}

Gui.prototype.setHealth = function(amount) {
  this.healthText.text = 'Health: ' + amount;
}