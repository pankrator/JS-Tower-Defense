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