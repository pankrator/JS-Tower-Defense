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

window.onload = function () {
  canvas = document.getElementById("game");
  context = canvas.getContext("2d");
  initializeHandlers();
  renderer = new Renderer(canvas, context);
  
  pathManager = new PathManager();
  defenseManager = new DefenseManager(towers, enemies);
  physicsManager = new PhysicsManager();
  towerManager = new TowerManager(towers);
  animationManager = new AnimationManager(renderer);
  
  path = new Path([{
   x: 30,
   y: 30 
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
  
  enemies.push(new Enemy());
  towers.push(new Tower(100, 150));
  towers.push(new Tower(350, 160));
  towers.push(new Tower(560, 160));
  towers.push(new Tower(350, 400));
  
  update();
}

var update = function () {
  renderer.clear();
  for (var i = 0; i < enemies.length; i++) {
    pathManager.followPath(enemies[i], path);
    if (enemies[i].reachedEnd) {
      // enemies.splice(i, 1);
    }
  }
  
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
}

var initializeHandlers = function () {
  canvas.addEventListener("click", handleMouseClick, true);
  window.addEventListener("keyup", handleKeyUp, true);
}

var SPACE_KEYKODE = 32;

var handleKeyUp = function (event) {
  if (event.keyCode == SPACE_KEYKODE) {
    BUILD_TOOL = BUILD_TOOL >= 1 ? 0 : BUILD_TOOL + 1;
  }
}

var handleMouseClick = function (event) {
  if (TOOLS[BUILD_TOOL] == "ADD_ENEMY") {
    enemies.push(new Enemy(event.clientX, event.clientY));
  } else if (TOOLS[BUILD_TOOL] == "CREATE_TOWER") {
    towers.push(new Tower(event.clientX, event.clientY));
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

var DefenseManager = function (towers, enemies) {
  this.enemies = enemies;
  this.towers = towers;
}

DefenseManager.prototype.update = function () {
  for (var i = 0; i < this.towers.length; i++) {
    var tower = this.towers[i];
    var possibleEnemies = this.getEnemiesInRange(tower);
    if (possibleEnemies.length > 0) {
      var targetEnemy = this.getClosestToFinishEnemy(possibleEnemies);
      tower.target = targetEnemy;
    } else {
      tower.target = null;
    }
  }
  
  for (var i = 0; i < this.enemies.length; i++) {
    var enemy = this.enemies[i];
    if (enemy.health < 1) {
      enemy.isDead = true;
    }
  }
}

DefenseManager.prototype.getClosestToFinishEnemy = function (enemies) {
  var target = enemies[0];
  for (var i = 1; i < enemies.length; i++) {
    if (target.currentPathIndex < enemies[i].currentPathIndex) {
      target = enemies[i];
    }
  }

  return target;
}

DefenseManager.prototype.getEnemiesInRange = function (tower) {
  var result = [];
  for (var i = 0; i < this.enemies.length; i++) {
    var enemy = this.enemies[i];
    if (enemy.isDead) {
      continue;
    }
    var distance = Math.sqrt((enemy.position.x - tower.x) * (enemy.position.x - tower.x) + (enemy.position.y - tower.y) * (enemy.position.y - tower.y));
    if (distance <= tower.range) {
      result.push(enemy);
    }
  }
  
  return result;
}

var AnimationManager = function (renderer) {
  this.renderer = renderer;
}

AnimationManager.prototype.update = function (collection) {
  for (var i = 0; i < collection.length; i++) {
    var animations = collection[i].playAnimations;
    for (var j = 0; j < animations.length; j++) {
      var animation = animations[j];
      if (animation.type === 'RAY') {
        renderer.renderLine(animation.beginPosition.x, animation.beginPosition.y,
                            animation.endPosition.x, animation.endPosition.y,
                            animation.style, animation.width);
      }

      animation.currentFrame++;
      if (animation.currentFrame >= animation.lengthInFrames) {
        animations.splice(j, 1);
      }
    }
  }
}
