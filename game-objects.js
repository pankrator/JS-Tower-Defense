var Tower = function (x, y) {
  this.x = x || 0;
  this.y = y || 0;
  this.width = 40;
  this.height = 40;
  this.range = 150;
  this.fireCooldown = 500;
  this.damage = 40;
  this.lastFireTime = 0;
  this.playAnimations = [];
  this.combatType = 'RAY';
  this.animations = {
    'shotAnimation': {
      type: 'RAY',
      lengthInFrames: 15,
      style: 'green',
      width: '7'
    }
  }
}

var Enemy = function (x, y) {
  this.speed = 3;
  this.isDead = false;
  this.position = new Vector(x, y);
  this.radius = 20;
  this.health = 100;
}

var Arrow = function (tower) {
  this.speed = 7;
  this.tower = tower;
  this.x = tower.x;
  this.y = tower.y;
  this.target = tower.target;
  this.direction = new Vector(this.target.x - this.x, this.target.y - this.y).normalized();
}