var _stage;
var _tileset;
var _preloader;

var _map = [];
var _debug; 

var _enemies = [];
var _units = [];
var _ship;

var _hover;
var _selectedUnit;

var _gui;

var _intro;

var started = false;

var _game = {
  money: 500,
  health: 100,
  clock: {
    hour: 14,
    min: 20,
  },
  wave: {
    vel: 5,
    amount: 3,
    interval: 8000
  }
}
var _enemyTimer;

var _info = {};

var _path = [
  [0, 576], // Start
  [415, 576],
  [415, 418],
  [130, 418],
  [130, 98],
  [612, 98],
  [612, 512],
  [896, 512],
  [896, 97] // End
]

// Ship Types
// 1 - Artillery
// 2 - Naval


function init() {
  _stage = new createjs.Stage('game');

  _intro = new Intro(_stage.canvas, startGame);

  _debug = new createjs.Shape();
  _debug.alpha = 0;

  _hover = new createjs.Shape();
  showHover(false);

  // Preloader
  _preloader = new createjs.LoadQueue();
  _preloader.addEventListener('complete', loaded);
  _preloader.loadManifest([
    {id: 'map', src: 'assets/map.json'},
    {id: 'unit_types', src: 'assets/units.json'},
    {id: 'tileset', src: 'assets/maptiles.png'},
    {id: 'ship', src: 'assets/battleship.png'},
  ])

  createjs.Ticker.addEventListener('tick', tick);
}

/* -- GUI Utilities -- */
function showHover(show) {
  if(show) _hover.alpha = 0.6;
  else _hover.alpha = 0;
}

function menuItemClicked(item) {
  // Don't allow double selection
  if(_selectedUnit) return;

  if(item.price <= _game.money) {
    showHover(true);
    _selectedUnit = item;
    _game.money -= item.price;
    _gui.setMoney(_game.money);
  }
}

function placeUnit() {
  var unit = new Unit(
    _hover.x + _info.tileWidth / 2,
    _hover.y + _info.tileWidth / 2,
    _selectedUnit
  );

  _units.push(unit);
  _stage.addChild(unit.shape);
  showHover(false);
  _selectedUnit = null;
}

/* -- Enemy Utilities -- */
function createEnemy(vel) {
  var enemy = new Enemy(_path, 5);
  enemy.addEventListener('finished', enemyFinished);
  enemy.addEventListener('destroyed', enemyDestroyed);
  _enemies.push(enemy);
  _stage.addChild(enemy.container);
}

function deployEnemies() {
  var i = 0;
  var timer = setInterval(function() {
    i++;
    if(i >= _game.wave.amount) clearInterval(timer);

    createEnemy(_game.wave.vel);
  }, 500);
}

function enemyFinished(enemy) {
  removeEnemy(enemy);
  _game.health -= 10;
  _gui.setHealth(_game.health);

  if(_game.health <= 0) {
    gameOver(false);
  }
}

function enemyDestroyed(enemy) {
  removeEnemy(enemy);
  _game.money += 80
  _gui.setMoney(_game.money);
}

function removeEnemy(enemy) {
  _stage.removeChild(enemy.container);
  var i = _enemies.indexOf(enemy);

  if(i !== -1) {
    _enemies.splice(i, 1);
  }
}

/* -- Events -- */

function startGame() {
  started = true;
  _stage.removeChild(_intro.container);

  // Setup game events
  this.document.onkeyup = onKeyPress;
  _stage.addEventListener('click', onStageClick);
  _stage.addEventListener('stagemousemove', onStageMouseMove);

  // Setup more UI
  _stage.addChild(_hover, _gui.container);

  setInterval(tickClock, 1000);
  runSpawner();
  deployEnemies();
}

function onStageClick(e) {
  if(typeof _hover.tile === undefined) return;
  if(_hover.tile === 0) return;
  if(_hover.alpha === 0) return;

  if(_selectedUnit) {
    if(_selectedUnit.type === _hover.tile) {
      placeUnit();
    }
  }
}

function onStageMouseMove(e) {
  var x = e.stageX;
  var y = e.stageY;

  var size = _info.tileWidth;

  var row = Math.floor(y / size);
  var col = Math.floor(x / size);

  var tile = _map[row][col];
  var color = 'red';

  _hover.x = col * size;
  _hover.y = row * size;
  _hover.tile = tile;

  // Unit was selected for hover
  if(_selectedUnit) {

    if(tile === _selectedUnit.type) {
      color = _selectedUnit.color
    }

    _hover.graphics.clear()
      .beginFill(color)
      .drawRect(0, 0, size, size);
  }
}

function onKeyPress(e) {
  // Esc
  if(e.keyCode === 27) {
    _debug.alpha = !_debug.alpha;
  }

  if(_debug.alpha == 1) {
    // Money
    if(e.keyCode == 77) {
      _game.money += 1000;
      _gui.setMoney(_game.money);
    }

    // Space
    else if(e.keyCode === 32) {
      //createEnemy();
      deployEnemies();
    }
  }
}

/* -- Engine Utilities -- */

function runSpawner() {
  if(_enemyTimer) {
    clearInterval(_enemyTimer);
  }

  _enemyTimer = setInterval(deployEnemies, _game.wave.interval);
}

function gameOver(won) {
  var url;

  if(won) {
    url = 'https://i.giphy.com/EWWdvQngcLt6g.gif';
  } else {
    url = 'https://i.giphy.com/d2Zh2evUqsXo7sje.gif';
  }

  window.top.location.href = url;
}

function loaded(e) {
  var loader = e.target;

  _tileset = new createjs.SpriteSheet({
    images: [loader.getResult('tileset')],
    frames: {
      width: 32,
      height: 32
    }
  });

  _gui = new Gui(
    loader.getResult('unit_types'), 
    _game, menuItemClicked
  );

  _gui.setMoney(_game.money);
  _gui.setHealth(_game.health);

  _ship = new createjs.Bitmap(loader.getResult('ship'));
  _ship.x = 750;
  _ship.y = 20;
  _ship.scaleX = 0.5;
  _ship.scaleY = 0.5;

  initMap(loader.getResult('map'));

  _stage.addChild(_ship, _intro.container);
  _stage.update(); 
}

function tick(e) {
  // Update enemies
  _enemies.forEach(function(enemy) {
    enemy.tick();
  });

  // Update units
  _units.forEach(function(unit) {
    unit.tick(_enemies);
  });

  _stage.update();
}

function tickClock() {
  _game.clock.min += 5;

  // Tick the clock
  if(_game.clock.min >= 60) {
    _game.clock.hour += 1;
    _game.clock.min = 0;

    if(_game.clock.hour >= 24) {
      _game.clock.hour = 0;
    }

    // Crappy way to incrase difficulty
    // Pls dont judge, its due tomorrow
    switch(_game.clock.hour) {
      case 17:
        _game.wave.amount = 4;
        break;

      case 18:
        _game.wave.vel = 8;
        _game.wave.amount = 5;
        break;

      case 19:
        _game.wave.vel = 10;    
        _game.wave.amount = 6;
        _game.wave.interval = 6000;
        runSpawner();
        break;

      case 22:
        _game.wave.vel = 13;
        _game.wave.amount = 8;
        _game.wave.interval = 4500;
        runSpawner();
        break;

      case 1:
        _game.wave.vel = 16;
        _game.wave.amount = 10;
        _game.wave.interval = 2800;
        runSpawner();
        break;

      case 4:
        _game.wave.vel = 22;
        _game.wave.amount = 12;
        _game.wave.interval = 1200;
        runSpawner();
        break;
    }
  }
  
  // Won the game
  if(_game.clock.hour === 7 && _game.clock.min >= 15) {
    gameOver(true);
  }

  _gui.setTime(_game.clock.hour + ':' + _game.clock.min);
}

function initMap(data) {
  var layers = data.layers;

  var mapWidth = data.width;
  var mapHeight = data.height;

  var tileWidth = data.tilewidth;
  var tileHeight = data.tileheight;

  _info = {
    mapWidth: mapWidth,
    mapHeight: mapHeight,
    tileWidth: tileWidth,
    tileHeight: tileHeight 
  }

  // Init layer map
  for(var r = 0; r < mapHeight; r++) {
    var row = [];
    for(var c = 0; c < mapWidth; c++) {
      row.push(0);
    }
    _map.push(row);
  }

  data.layers.forEach(function(layer, i) {
    var width = layer.width;
    var height = layer.height;
    var name = layer.name;

    layer.data.forEach(function(tile, i) {
      if(tile === 0) return;
      
      var row = Math.floor(i / width);
      var col = Math.floor(i % width);

      // Draw map
      var shape = new createjs.Sprite(_tileset, tile - 1);
      shape.x = col * tileWidth;
      shape.y = row * tileHeight;
      shape.stop();

      // Draw type
      if(name === 'Land') {
        _map[row][col] = 1;
      } else if (name === 'Ocean') {
        _map[row][col] = 2;
      }

      _stage.addChild(shape);
    });
  });


  var g = _debug.graphics;
  g.beginStroke('#FF00FF');

  // Draw grid
  for(var r = 0; r < mapHeight; r++) {
    for(var c = 0; c < mapWidth; c++) {
      var tile = _map[r][c];
      var w = tileWidth
      var h = tileHeight
      var x = c*w
      var y = r*h

      if(tile > 0) {
        if(tile == 1) g.beginFill('#CCCCCC');
        else if(tile == 2) g.beginFill('#FFB6C1');
        g.drawRect(x,y,w,h);
        g.endFill();
      }

      // Bound
      g.drawRect(x, y, w, h);
    }
  }
  
  _stage.addChild(_debug);
}