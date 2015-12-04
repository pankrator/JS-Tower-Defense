var COMBAT_METHODS = {
  "RAY": function (manager, tower) {
    if (tower.target) {
      var target = tower.target;
      target.health -= tower.damage;
      
      tower.playAnimations.push(new Animation(tower.animations['shotAnimation'], {
        beginPosition: new Vector(tower.x, tower.y), // TODO: Use tower.position
        endPosition: target.position
      }));
    }
  },
  "ARROW": function (manager, tower) {
    if (!tower.arrows) {
      tower.arrows = [];
    }
    tower.arrows.push(new Arrow(tower));
    for (var i = 0; i < tower.arrows.length; i++) {
      var arrow = tower.arrows[i];
      arrow.direction = new Vector(arrow.target.x - arrow.x, arrow.target.y - arrow.y).normalized();
      arrow.x += arrow.direction.x * arrow.speed;
      arrow.y += arrow.direction.y * arrow.speed;
    }
  }
};


var Animation = function (initialProperties, additionalProperties) {
  this.currentFrame = 0;
  for (var key in initialProperties) {
    this[key] = initialProperties[key];
  }
  for (var key in additionalProperties) {
    this[key] = additionalProperties[key];
  }
};