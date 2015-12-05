/* global Vector */

var DEBUG = true;

var canvas;
var context;
var renderer;
var enemies = [];
var towers = [];
var path;

var towerManager;
var pathManager;
var defenseManager;
var physicsManager;
var animationManager;
var waveManager;

window.onload = function () {
  canvas = document.getElementById("game");
  context = canvas.getContext("2d");
  initializeHandlers();
  renderer = new Renderer(canvas, context);
  
  waveManager = new WavesManager();
  enemies = waveManager.enemies;
  pathManager = new PathManager();
  defenseManager = new DefenseManager(towers, enemies);
  physicsManager = new PhysicsManager();
  towerManager = new TowerManager(towers);
  animationManager = new AnimationManager(renderer);

  path = new Path([{
   x: 60,
   y: 140 
  },{
   x: 200,
   y: 40 
  },{
   x: 300,
   y: 30 
  },{
   x: 550,
   y: 60 
  },{
   x: 550,
   y: 200
  },{
   x: 200,
   y: 550
  },{
   x: 350,
   y: 550
  },{
   x: 600,
   y: 450
  },{
   x: 1000,
   y: 500
  }]);

  update();
}

var update = function () {
  for (var i = 0; i < enemies.length; i++) {
    pathManager.followPath(enemies[i], path);
    if (enemies[i].reachedEnd) {
      // enemies.splice(i, 1);
    }
  }
  
  waveManager.update();
  defenseManager.update();
  towerManager.update();
  
  render();
  
  setTimeout(update, 1000 / 60);
}

var render = function () {
  renderer.clear();
  for (var i = 0; i < enemies.length; i++) {
    renderer.renderEnemy(enemies[i]);
  }
  
  for (var i = 0; i < towers.length; i++) {
    renderer.renderTower(towers[i]);
  }
  
  animationManager.update(towers);
  
  if (DEBUG) {
    renderer.renderPath(path, "blue");
  }

  renderer.renderText(20, 20, "Level: " + waveManager.level);
  if (waveManager.isFinished()) {
    renderer.renderText(90, 20, "Finished");
  }
  renderer.renderText(20, 40, "Gold: " + gameConfig.gold);
}

var initializeHandlers = function () {
  canvas.addEventListener("click", handleMouseClick, true);
  window.addEventListener("keyup", handleKeyUp, true);
}

var SPACE_KEYKODE = 32;
var L_KEYCODE = 76;

var handleKeyUp = function (event) {
  if (event.keyCode == SPACE_KEYKODE) {
    BUILD_TOOL = BUILD_TOOL >= 1 ? 0 : BUILD_TOOL + 1;
  }
  if (event.keyCode == L_KEYCODE) {
    if (waveManager.isFinished()) {
      waveManager.finalizeLevel();
    } else {
      waveManager.startLevel(path);
    }
  }
}

var handleMouseClick = function (event) {
  if (TOOLS[BUILD_TOOL] == "ADD_ENEMY") {
    // enemies.push(new Enemy(event.clientX, event.clientY));
  } else if (TOOLS[BUILD_TOOL] == "CREATE_TOWER") {
    buildTower(event.clientX, event.clientY);
  }
}

var buildTower = function (x, y) {
  if (gameConfig.gold >= 120) {
    towers.push(new Tower(x, y));
    gameConfig.gold -= 120;
  }
}

var PhysicsManager = function () {};

PhysicsManager.prototype.update = function (collection) {
  for (var i = 0; i < collection.length; i++) {
    var object = collection[i];
    // TODO: Apply update delta
    object.x += object.direction.x * object.speed;
    object.y += object.direction.y * object.speed;
  }
}

var TowerManager = function (towers) {
  this.towers = towers;
  this.combatMethods = COMBAT_METHODS; // TODO: Populate methods by ContentManager
}

TowerManager.prototype.update = function () {
  for (var i = 0; i < this.towers.length; i++) {
    var tower = this.towers[i];
    var combatMethod = null;
    
    if (Date.now() - tower.lastFireTime > tower.fireCooldown) {
      combatMethod = this.combatMethods[tower.combatType];
      combatMethod && combatMethod(this, tower);
      tower.lastFireTime = Date.now();
    }
  }
}

