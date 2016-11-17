var stage;
var tileset;
var preloader;

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

  stage.addEventListener('click', function(e) {
    var enemy = new Enemy(path);
    enemy.addEventListener('finished', enemyFinished);
    enemy.addEventListener('destroyed', enemyDestroyed);
    enemies.push(enemy);
    stage.addChild(enemy.shape);
  });

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

function enemyFinished() {
  console.log('finished');
}

function enemyDestroyed() {
  console.log('destroyed');
}

function initMap(data) {
  var layers = data.layers;

  var tileWidth = data.tilewidth;
  var tileHeight = data.tileheight;

  data.layers.forEach(function(layer, i) {
    var width = layer.width;
    var height = layer.height;

    layer.data.forEach(function(tile, i) {
      if(tile === 0) return;
      
      var row = Math.floor(i / width);
      var col = Math.floor(i % width);

      var shape = new createjs.Sprite(tileset, tile - 1);
      shape.x = col * tileWidth;
      shape.y = row * tileHeight;
      shape.stop();

      stage.addChild(shape);
    });
  });
}