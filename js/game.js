var _stage;
var _tileset;
var _preloader;

var _map = [];
var _debug; 

var _enemies = [];
var _units = [];

var _hover;
var _gui;

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

function init() {
  _stage = new createjs.Stage('game');

  _debug = new createjs.Shape();
  _debug.alpha = 0;

  _hover = new createjs.Shape();
  _hover.alpha = 0.6;

  _gui = new Gui();

  // stage.addEventListener('click', function(e) {
    
  // });

  this.document.onkeyup = function(e) {
    console.log(e);

    // Esc
    if(e.keyCode === 27) {
      _debug.alpha = !_debug.alpha;
    }

    // Space
    else if(e.keyCode === 32) {
      var enemy = new Enemy(_path);
      enemy.addEventListener('finished', enemyFinished);
      enemy.addEventListener('destroyed', enemyDestroyed);
      _enemies.push(enemy);
      _stage.addChild(enemy.shape);
    }
  }

  _stage.addEventListener('click', function(e) {
    if(typeof _hover.tile === undefined) return;
    if(_hover.tile === 0) return;

    var color = 'purple';
    if(_hover.tile === 2) color = 'black';

    var unit = new createjs.Shape();
    unit.graphics.beginFill(color).drawCircle(0, 0, 5);
    unit.x = _hover.x + _info.tileWidth / 2;
    unit.y = _hover.y + _info.tileWidth / 2;

    _units.push(unit);
    _stage.addChild(unit);
    //var unit = new Unit()
  })

  _stage.addEventListener('stagemousemove', function(e) {
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

    // Ground unit
    if(tile > 0) {
      color = 'green';
    }

    _hover.graphics.clear().beginFill(color).drawRect(0, 0, size, size);
  })

  // Preloader
  _preloader = new createjs.LoadQueue();
  _preloader.addEventListener('complete', loaded);

  _preloader.loadFile({id: 'map', src: 'assets/map.json'});
  _preloader.loadFile({id: 'tileset', src: 'assets/maptiles.png'});

  createjs.Ticker.addEventListener('tick', tick);
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

  initMap(loader.getResult('map'));

  _stage.update(); 
}

function tick(e) {
  // Update enemies
  _enemies.forEach(function(enemy) {
    enemy.tick();
  });

  _stage.update();
}

function enemyFinished(enemy) {
  console.log('finished');
}

function enemyDestroyed(enemy) {
  console.log('destroyed');
  console.log(enemy);
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

      if(tile === 1) {
        g.beginFill('#FFA500');
        g.drawRect(x,y,w,h);
        g.endFill();
      }

      // Bound
      g.drawRect(x, y, w, h);
    }
  }
  
  _stage.addChild(_debug);
  _stage.addChild(_hover);
  _stage.addChild(_gui.container);
}