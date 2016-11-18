var stage;
var tileset;
var preloader;

var _map = [];
var _debug = null; 

var enemies = [];

var path = [
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
  stage = new createjs.Stage('game');

  _debug = new createjs.Shape();

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
      var enemy = new Enemy(path);
      enemy.addEventListener('finished', enemyFinished);
      enemy.addEventListener('destroyed', enemyDestroyed);
      enemies.push(enemy);
      stage.addChild(enemy.shape);
    }
  }

  stage.addEventListener('click', function(e) {
    console.log(e);
    //var unit = new Unit()
  })

  // Preloader
  preloader = new createjs.LoadQueue();
  preloader.addEventListener('complete', loaded);

  preloader.loadFile({id: 'map', src: 'assets/map.json'});
  preloader.loadFile({id: 'tileset', src: 'assets/maptiles.png'});

  createjs.Ticker.addEventListener('tick', tick);
}

function loaded(e) {
  var loader = e.target;

  tileset = new createjs.SpriteSheet({
    images: [loader.getResult('tileset')],
    frames: {
      width: 32,
      height: 32
    }
  });

  initMap(loader.getResult('map'));

  stage.update(); 
}

function tick(e) {
  // Update enemies
  enemies.forEach(function(enemy) {
    enemy.tick();
  });

  stage.update();
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
      var shape = new createjs.Sprite(tileset, tile - 1);
      shape.x = col * tileWidth;
      shape.y = row * tileHeight;
      shape.stop();

      // Draw type
      if(name === 'Land') {
        _map[row][col] = 1;
      }

      stage.addChild(shape);
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

  stage.addChild(_debug);
}