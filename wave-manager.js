var ENEMIES_PER_LEVEL = 5;
var LIFE_MULTIPLIER = 20;
var INTERVAL_BETWEEN_CREATION = 300;

var WavesManager = function () {
  this.level = 1;
  // TODO: May be it is better if enemies are just returned by manager and not stored in it.
  this.enemies = [];

  this.state = 'IDLE';
  this.enemiesCreated = 0;
  this.currentEnemiesLimit = 0;
}

WavesManager.prototype.startLevel = function (path) {
  if (this.state === 'IDLE') {
    this.enemies.length = 0;
    this.state = 'RUNNING';
    this.path = path;
    this.currentEnemiesLimit = this.level * ENEMIES_PER_LEVEL;
    this.enemiesCreated = 0;

    setTimeout(this.addEnemy.bind(this), INTERVAL_BETWEEN_CREATION);
  }
}

WavesManager.prototype.addEnemy = function () {
  if (this.state === 'RUNNING') {
    var point = this.path.points[0];
    var enemy = new Enemy(point.x, point.y);
    enemy.health += this.level * LIFE_MULTIPLIER;
    this.enemies.push(enemy);
    this.enemiesCreated++;
    if (this.enemiesCreated < this.currentEnemiesLimit) {
      setTimeout(this.addEnemy.bind(this), INTERVAL_BETWEEN_CREATION);
    }
  }
}

WavesManager.prototype.update = function () {
  var areAlive = this.enemies.some(function (enemy) { return !enemy.isDead; });
  if (!areAlive && this.state == 'RUNNING' &&
      this.enemiesCreated == this.currentEnemiesLimit) {
    this.state = 'FINISHED';
  }
}

WavesManager.prototype.finalizeLevel = function () {
  if (this.state === 'FINISHED') {
    this.level++;
    this.state = 'IDLE';
  }
}

WavesManager.prototype.isFinished = function () {
  return this.state === 'FINISHED';
}